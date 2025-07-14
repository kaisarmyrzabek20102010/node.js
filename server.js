const express = require('express');
const jwt = require('jsonwebtoken');
const pool = require('./pool'); 
require('dotenv').config();

const app = express();
app.use(express.json());

const JWT_SECRET = 'secret123';
 
function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(400).json({ message: 'Token керек' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(404).json({ message: 'qate' });
  }
}
 
app.post('/login', (req, res) => {
  const user = { id: 1, name: 'TestUser' };
  const token = jwt.sign(user, JWT_SECRET, { expiresIn: '1h' });
  res.json({ token });
});
 
app.post('/products', authMiddleware, async (req, res) => {
  const { name, price, quantity } = req.body;

  try {
    const result = await pool.query(
      'INSERT INTO products (name, price, quantity) VALUES ($1, $2, $3) *',
      [name, price, quantity]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(404).json({ message: 'qate'});
  }
});
 
app.get('/products', authMiddleware, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM products');
    res.json(result.rows);
  } catch (err) {
    res.status(404).json({ message: 'qate'});
  }
});
 
app.get('/profile', authMiddleware, (req, res) => {
  res.json({ message: 'hi   ' });
});
 
app.listen(3000, () => {
  console.log('aqwerty');
});
