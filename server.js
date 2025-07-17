const express = require('express');
const rateLimit = require('express-rate-limit');

const app = express();
app.use(express.json());

const loginLimiter = rateLimit({
  windowMs: 5 * 60000, 
  max: 3, 
  statusCode: 429,
  message: {
    error: "sen 5 min kirmeisyn"
  },
  legacyHeaders: false,
  standardHeaders: true
});
 
app.post('/login', loginLimiter, (req, res) => {
  res.send({ message: 'login jasaldy' });
});
 
app.listen(3000, () => {
  console.log('Сервер 3000 портында жұмыс істеуде');
});
