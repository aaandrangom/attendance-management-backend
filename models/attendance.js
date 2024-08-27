import { turso } from "../db/client.js";

export const AttendanceModel = {
    async postAttendance(data) {
        const {
            user_id,
            qr_id
        } = data;

        const query = `
            INSERT
            INTO attendance(
                user_id,
                qr_id
            )
            VALUES(?, ?)
        `;

        await turso.execute({
            sql: query,
            args: [
                user_id,
                qr_id
            ]
        });
    },

    async existisAttendance(user_id, qr_id) {
        const query = `
            SELECT *
            FROM Attendance
            WHERE user_id = ? 
            AND qr_id = ?
        `;

        const result = await turso.execute({
            sql: query,
            args: [
                user_id,
                qr_id
            ]
        });

        return result.rows;
    },

    async getAttendance(user_id) {
        const query = `
            SELECT
                DATE(dq.date) as date,
                CASE
                    WHEN a.user_id IS NOT NULL THEN 'true'
                    ELSE 'false'
                END AS attendance
            FROM
                daily_qr dq
                LEFT JOIN attendance a ON dq.qr_id = a.qr_id
                AND a.user_id = ?
                AND DATE(a.timestamp) = DATE(dq.date) 
            ORDER BY
                DATE(dq.date) DESC;
        `;

        const result = await turso.execute({
            sql: query,
            args: [
                user_id
            ]
        });

        return result.rows;
    },

    async getLastAttendance(user_id) {
        const query = `
            SELECT 
                CASE
                    WHEN a.user_id IS NOT NULL THEN 'true'
                    ELSE 'false'
                END AS attendance
            FROM 
                daily_qr dq
                LEFT JOIN attendance a ON dq.qr_id = a.qr_id
                AND a.user_id = ?
            WHERE 
                dq.date = (
                    SELECT MAX(date) 
                    FROM daily_qr
                )
        `;

        const result = await turso.execute({
            sql: query,
            args: [
                user_id
            ]
        });

        return result.rows;
    }
}