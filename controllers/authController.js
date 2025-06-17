import jwt from 'jsonwebtoken';
import User from '../models/user.js';

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });
};

// @route POST /api/auth/register
export const register = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ error: 'User already exists' });

    const user = await User.create({ name, email, password });
    const token = generateToken(user._id);
    res.status(201).json({ token, user: { id: user._id, name, email } });
  } catch (err) {
    res.status(500).json({ error: 'Registration failed' });
    console.log(err)
  }
};

// @route POST /api/auth/login
export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });

    // ✅ Step 1: Check if user exists
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // ✅ Step 2: Check if account is active BEFORE comparing password
    if (!user.isActive) {
      return res.status(403).json({ error: 'Account is deactivated. Please reactivate to log in.' });
    }

    // ✅ Step 3: Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // ✅ Step 4: Generate token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.status(200).json({
      token,
      user: { id: user._id, name: user.name, email: user.email }
    });
  } catch (err) {
    res.status(500).json({ error: 'Login failed' });
  }
};
