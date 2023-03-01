import jwt from 'jsonwebtoken';
import User from '../model/User.model.js';
export const isAuthenticatedUser = async(req, res, next) => {
    const { token } = req.cookies;

    console.log(token);
    if (!token) {
        return next("Please Login to access this resource", 401);
    }

    const decodedData = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await User.findById(decodedData.id);

    next();
};
export const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next((`Role: ${req.user.role} is not allowed to access this resouce `, 403));
        }
        next();
    };
};