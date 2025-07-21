const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');
const { JWT_SECRET } = require('../config/env');

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'token joq ili katw' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; 
    next();
  } catch (err) {
    return res.status(403).json({ message: 'token kate' });
  }
};

const errorHandler = (err, req, res, next) => {
  console.error('Error:', err.stack || err.message);
  res.status(500).json();
};

const limiter = rateLimit({
  windowMs: 60 * 1000, 
  max: 5,              
  message: '1 min bandasyn',
  standardHeaders: true, 
  legacyHeaders: false,  
});

module.exports = {
  authMiddleware,
  errorHandler,
  limiter,
};
