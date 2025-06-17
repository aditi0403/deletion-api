import User from '../models/user.js';

export const deactivateAccount = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    user.isActive = false;
    await user.save();

    res.json({ message: 'Account deactivated. You can reactivate anytime.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to deactivate account' });
  }
};

export const reactivateAccount = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    user.isActive = true;
    await user.save();

    res.json({ message: 'Account reactivated successfully.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to reactivate account' });
  }
};
