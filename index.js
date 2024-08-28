import express from 'express';
import userRoutes from './routes/users.js';
import qrRoutes from './routes/qr.js';
import attendanceRoutes from './routes/attendance.js';
import cookieParser from 'cookie-parser';
import { configDotenv } from "dotenv";
import { corsMiddleware } from './middleware/cors.js';

configDotenv();

const app = express();
const PORT = process.env.PORT || 3000;
const server = process.env.LOCALHOST || 'localhost';

app.use(express.json());
app.use(corsMiddleware());
app.use(cookieParser());

app.use('/api/v1/users', userRoutes);
app.use('/api/v1/qr', qrRoutes);
app.use('/api/v1/attendance', attendanceRoutes)

app.listen(PORT, () => {
    console.log(`Server running at ${PORT}`);
});