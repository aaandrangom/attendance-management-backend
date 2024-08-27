import { UserModel } from '../models/users.js';
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';

export const UserController = {
    async postUser(req, res) {
        try {
            const data = req.body;

            const userExists = await UserModel.
                readUserByUsername(data.username);
            if (userExists) {
                return res.status(400).json({
                    msg: 'User already exists'
                });
            }

            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.
                hash(data.password_hash, salt);
            data.password_hash = hashedPassword

            const code = uuidv4();
            data.uid = code;

            const newUser = await UserModel.
                createUser(data);

            res.status(200).json({
                msg: 'Ok',
                body: newUser
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({
                msg: 'Error creating user',
                error: error.message
            });
        }
    },

    async signIn(req, res) {
        try {
            const { username, password } = req.body;

            const user = await UserModel.
                readUserByUsername(username);

            if (!user) {
                return res.status(404).json({
                    msg: 'Invalid credentials'
                });
            }

            const isMatch = await bcrypt.compare(
                password,
                user.password_hash,
            );

            if (!isMatch) {
                return res.status(404).json({
                    msg: 'Incorrect password'
                });
            }

            const token = jwt.sign(
                { id: user.user_id },
                process.env.JWT_SECRET,
                { expiresIn: '1h' }
            );

            res.cookie('access_token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                maxAge: 3600000,
                sameSite: 'strict'
            });

            res.status(200).json({
                msg: 'Login successful',
                body: user.user_id
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({
                msg: 'Error signing user',
                error: error.message
            });
        }
    },

    async logout(req, res) {
        try {
            const token = req.cookies.access_token;
            res.clearCookie('access_token')
            res.status(200).json({
                msg: 'Logged out successfully'
            });
        } catch (error) {
            res.status(500).json({
                msg: 'Error logging out',
                error: error.message
            });
        }
    },

    async getUserLoggedIn(req, res) {
        try {
            const user_id = req.user.id

            const result = await UserModel.readUserById(user_id);

            if (result.length === 0) {
                res.status(404).json({
                    msg: 'User not found'
                });
            }

            res.status(200).json({
                msg: 'Ok',
                body: result
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({
                msg: 'Error getting user logged in',
                error: error.message
            });
        }
    },

    async test(req, res) {
        res.status(200).json({
            msg: 'Test successful'
        });
    }
}
