import QRCode from 'qrcode';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { QrModel } from '../models/qr.js';

export const QRController = {
    async generateQRCode(req, res) {
        try {
            const secretKey = process.env.JWT_SECRET;
            const now = new Date();

            const year = now.getFullYear();
            const month = String(now.getMonth() + 1).padStart(2, '0');
            const day = String(now.getDate()).padStart(2, '0');
            const hours = String(now.getHours()).padStart(2, '0');
            const minutes = String(now.getMinutes()).padStart(2, '0');
            const seconds = String(now.getSeconds()).padStart(2, '0');

            const localDateTime = `${year}-${month}-${day}
             ${hours}:${minutes}:${seconds}`;

            const code = uuidv4();

            const payload = {
                id: code,
                date: localDateTime,
            };

            const token = jwt.sign(
                payload,
                secretKey,
                { expiresIn: '1d' }
            );

            const qrCodeDataURL = await QRCode.toDataURL(token);

            const data = {
                date: localDateTime,
                token: token,
                qr_code: qrCodeDataURL
            };

            const result = await QrModel.postQr(data);

            res.status(200).json({
                msg: 'Ok',
                body: qrCodeDataURL
            });
        } catch (error) {
            res.status(500).json({
                msg: 'Error generating QR',
                error: error.message
            });
        }
    },
};
