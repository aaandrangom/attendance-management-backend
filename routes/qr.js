import express from 'express';
import { QRController } from '../controllers/qr.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();

router.post('/', authMiddleware, QRController.generateQRCode);
router.get('/today', authMiddleware, QRController.getQrToday)

export default router