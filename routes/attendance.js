import express from 'express';
import { AttendanceController } from '../controllers/attendance.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();

router.post('/', authMiddleware, AttendanceController.registerAttendance);
router.get('/', authMiddleware, AttendanceController.getAttendanceByUser);
router.get('/last-attendance', authMiddleware, AttendanceController.getLastAttendanceUser);

export default router