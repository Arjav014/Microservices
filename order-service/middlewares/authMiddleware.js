const jwt = require("jsonwebtoken");

// const User = require("../model/User"); // Wait, User is in user-service, need to get user info from user-service

// Since it's microservices, perhaps no User model here. Instead, verify JWT and set req.userId

// But to get user email later, perhaps decode and assume userId is in token.

// Assuming JWT payload has id as userId

exports.protect = async (req, res, next) => {
    try {
        let token;
        if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if(!token) {
            return res.status(401).json({
                message: 'Not authorized, please login'
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.id; // Assuming id in token
        next();
    } catch(error) {
        logger.error(error);
        res.status(401).json({
            message: 'Error while validating token...'
        })
    }
}