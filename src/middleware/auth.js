const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../constants');

// Middleware to authenticate the user based on JWT
const auth = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '').trim();


    if (!token) {
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET, { expiresIn: '12d' });

        req.user = decoded.user;

        next();
    } catch (err) {

        res.status(401).json({ msg: 'Token is not valid' });
    }
};

module.exports = auth;
