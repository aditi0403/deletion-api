import express from 'express';
import protect from '../middlewares/authMiddleware.js';
import { deleteAccount } from '../controllers/deleteController.js';
import { sensitiveLimiter } from '../middlewares/rateLimiter.js';
import { deactivateAccount, reactivateAccount } from '../controllers/softDeleteController.js';

/**
 * @swagger
 * /api/delete:
 *   delete:
 *     summary: Delete user account
 *     description: Permanently delete the authenticated user's account. This action cannot be undone.
 *     tags: [Account Management]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Account deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Account deleted successfully"
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Not authorized, token failed"
 *       429:
 *         description: Too many requests - Rate limit exceeded
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Too many requests, please try again later"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Server error"
 */

const router = express.Router();

// Apply limiter only on DELETE
router.delete('/delete', protect, sensitiveLimiter, deleteAccount);
router.patch('/deactivate', protect, deactivateAccount);
router.patch('/reactivate', protect, reactivateAccount);

export default router;