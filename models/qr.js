import { turso } from "../db/client.js";

export const QrModel = {
    async postQr(data) {
        const {
            date,
            token,
            qr_code
        } = data;

        const query = `
            INSERT 
            INTO daily_qr(
                date,
                token,
                qr_code
            )
            VALUES(?, ?, ?)
        `;

        const result = await turso.execute({
            sql: query,
            args: [
                date,
                token,
                qr_code
            ]
        });

        return result !== null
    },

    async getQrByToken(token) {
        const query = `
            SELECT *
            FROM daily_qr
            WHERE token = ?
        `;

        const result = await turso.execute({
            sql: query,
            args: [
                token
            ]
        });

        return result.rows[0];
    },

    async getQrToday() {
        const query = `
            SELECT
                qr_id,
                date,
                token,
                qr_code
            FROM
                daily_qr
            WHERE
                DATE(date) = DATE('now')
        `;

        const result = await turso.execute(query);
        return result.rows[0];
    }
}