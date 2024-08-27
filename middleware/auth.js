import jwt from 'jsonwebtoken';

function authMiddleware(req, res, next) {
    const token = req.cookies.access_token;
    if (!token) {
        return res.status(401).json({
            msg: 'No token provided'
        });
    }

    try {
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        req.user = decoded;

        next();
    } catch (error) {
        return res.status(401).json({
            msg: 'Invalid token',
            error: error.message
        });
    }
}

export default authMiddleware