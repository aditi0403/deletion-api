import axios from 'axios';
import User from '../models/user.js';
import DeletionLog from '../models/DeletionLog.js';
import { sendDeletionEmail } from '../utils/email.js';

// @route DELETE /api/user/delete
export const deleteAccount = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    // Log the deletion
    await DeletionLog.create({
      userId: user._id,
      email: user.email,
    });

    // Send webhook notification if set
    if (process.env.WEBHOOK_URL) {
      try {
        await axios.post(process.env.WEBHOOK_URL, {
          event: 'user_deleted',
          userId: user._id,
          email: user.email,
          deletedAt: new Date(),
        });
      } catch (err) {
        console.error('Webhook failed:', err.message);
      }
    }
    // Send confirmation email
    await sendDeletionEmail(user.email);

    // Anonymize data (instead of hard delete)
    user.name = 'Anonymized';
    user.email = `deleted_${user._id}@noemail.com`;
    user.password = 'deleted';
    await user.save();

    res.json({ message: 'Your account and data have been anonymized and deleted.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete account' });
    console.log(err)
  }
};
