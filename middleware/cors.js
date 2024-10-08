import cors from 'cors';

const ACCEPTED_ORIGINS = [
    "http://localhost:5173",
    "",
];

export const corsMiddleware = (
    { acceptedOrigins = ACCEPTED_ORIGINS } = {}
) => {
    return cors({
        origin: (origin, callback) => {
            if (acceptedOrigins.includes(origin) || !origin) {
                callback(null, true);
            } else {
                callback(new Error('Not allowed by CORS'));
            }
        },
        credentials: true,
    });
};