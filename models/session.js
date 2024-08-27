import { turso } from "../db/client.js";

export const SessionModel = {
    async createSession(data) {
        const {
            user_id,
            token,
            expires_at
        } = data;

        const query = `
            INSERT
            INTO sessions(
                user_id,
                token,
                expires_at
            )
            VALUES(?, ?, ?)
        `;

        const result = await turso.execute({
            sql: query,
            args: [
                user_id,
                token,
                expires_at
            ]
        });

        return result !== null
    }
}