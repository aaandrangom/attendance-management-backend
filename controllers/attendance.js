import jwt from 'jsonwebtoken';
import { AttendanceModel } from '../models/attendance.js';
import { QrModel } from '../models/qr.js'

export const AttendanceController = {
    async registerAttendance(req, res) {
        try {
            const user_id = req.user.id;
            const { qrToken } = req.body;

            if (!qrToken || !user_id) {
                return res.status(400).json({
                    msg: 'Qr token and user_id are required',
                });
            }

            const secretKey = process.env.JWT_SECRET;
            let qrPayload;

            try {
                qrPayload = jwt.verify(qrToken, secretKey);
            } catch (error) {
                return res.status(400).json({
                    msg: `The scanned QR code is not recognized by our system.`,
                    error: error.message
                });
            }

            const qrDate = qrPayload.date;

            const qrDateOnly = new Date(qrDate).toISOString().split('T')[0];
            const today = new Date().toISOString().split('T')[0];

            if (today !== qrDateOnly) {
                return res.status(400).json({
                    msg: 'QR is not valid for today',
                });
            }

            const qrRecord = await QrModel.getQrByToken(qrToken);
            if (!qrRecord) {
                return res.status(400).json({
                    msg: 'QR not found'
                });
            }

            const qrIdFromDb = qrRecord.qr_id;

            const existingAttendance = await AttendanceModel.existisAttendance(
                user_id,
                qrIdFromDb
            );

            if (existingAttendance.length !== 0) {
                return res.status(400).json({
                    msg: 'Attendance has already been registered for today'
                });
            }

            const data = {
                user_id: user_id,
                qr_id: qrIdFromDb
            }
            await AttendanceModel.postAttendance(data);

            res.status(200).json({
                msg: 'Attendance registered successfully'
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({
                msg: 'Error registering attendance',
                error: error.message
            });
        }
    },

    async getAttendanceByUser(req, res) {
        try {
            const user_id = req.user.id;
            const result = await AttendanceModel.getAttendance(user_id);

            if (result.length === 0) {
                return res.status(404).json({
                    msg: 'No records'
                });
            }

            res.status(200).json({
                msg: 'Ok',
                body: result
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({
                msg: 'Error getting records',
                error: error.message
            });
        }
    },

    async getLastAttendanceUser(req, res) {
        try {
            const user_id = req.user.id;
            const result = await AttendanceModel.getLastAttendance(user_id);

            if (result.length === 0) {
                return res.status(404).json({
                    msg: 'No records'
                });
            }


            res.status(200).json({
                msg: 'Ok',
                body: result
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({
                msg: 'Error getting records',
                error: error.message
            });
        }
    }
}