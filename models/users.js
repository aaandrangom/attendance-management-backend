import { turso } from "../db/client.js";

export const UserModel = {
    async createUser(data) {
        const {
            username,
            password_hash,
            role,
            uid
        } = data;

        const query = `
            INSERT
            INTO users(
                username,
                password_hash,
                role,
                uid
            )
            VALUES (?, ?, ?, ?)
        `;

        const result = await turso.execute({
            sql: query,
            args: [
                username,
                password_hash,
                role,
                uid
            ]
        });

        const newUser = await UserModel.readUserById(
            result.lastInsertRowid
        );

        return newUser
    },

    async readUserById(user_id) {
        const query = `
            SELECT * 
            FROM users
            WHERE user_id = ?
        `;

        const result = await turso.execute({
            sql: query,
            args: [user_id]
        });

        return result.rows;
    },

    async readUserByUsername(username) {
        const query = `
            SELECT *
            FROM users
            WHERE username = ?
        `;

        const result = await turso.execute({
            sql: query,
            args: [username]
        });

        return result.rows[0];
    }
}