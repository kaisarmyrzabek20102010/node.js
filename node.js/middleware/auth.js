const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/env');
const rateLimit = require('express-rate-limit');

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.sendStatus(401);

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.sendStatus(403);
  }
};

const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong');
};

const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, 
  max: 5,                  
  message: 'Too many requests, try again later',
  statusCode: 429,
});

module.exports = {
  authMiddleware,
  errorHandler,
  limiter,
};
