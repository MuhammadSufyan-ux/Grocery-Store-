import jwt from "jsonwebtoken";
import User from "../models/User.js";

// Optional auth middleware - attaches user if token is valid, but doesn't require it
export const optionalAuth = async (req, res, next) => {
    try {
        let token;

        // Check for token in Authorization header
        if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
            token = req.headers.authorization.split(" ")[1];
        }

        if (token) {
            try {
                // Verify token
                const decoded = jwt.verify(token, process.env.JWT_SECRET);

                // Get user from token
                const user = await User.findById(decoded.id).select("-password");

                if (user && user.isActive) {
                    req.user = user;
                }
            } catch (error) {
                // Invalid token, but continue without user
                req.user = null;
            }
        } else {
            req.user = null;
        }

        next();
    } catch (error) {
        // Error checking auth, but continue without user
        req.user = null;
        next();
    }
};
