import express from 'express';
import protect from '../middlewares/authMiddleware.js';
import adminOnly from '../middlewares/adminMiddleware.js';
import DeletionLog from '../models/DeletionLog.js';

const router = express.Router();

/**
 * @swagger
 * /api/admin/deletions:
 *   get:
 *     summary: Get all deletion logs (Admin only)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of deletion logs
 */
router.get('/deletions', protect, adminOnly, async (req, res) => {
  const logs = await DeletionLog.find().populate('userId', 'email name');
  res.json(logs);
});

export default router;
