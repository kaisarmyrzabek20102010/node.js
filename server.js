const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const rateLimit = require("express-rate-limit");
const pool = require("./db");

const app = express();
app.use(express.json());
app.use(cors());
app.use(helmet());

const SECRET_KEY = "secret123";

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) return res.status(401).json({ message: "Token жоқ" });

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ message: "Token жарамсыз" });
  }
}

app.post("/register", async (req, res) => {
  const { username, password } = req.body;
  const hashed = await bcrypt.hash(password, 10);

  try {
    await pool.query("INSERT INTO users(username, password) VALUES($1, $2)", [
      username.toLowerCase(),
      hashed,
    ]);
    res.json({ message: "Тіркелу сәтті өтті" });
  } catch (err) {
    res.status(500).json({ error: "Пайдаланушыны тіркеу кезінде қате болды" });
  }
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const result = await pool.query("SELECT * FROM users WHERE username=$1", [
      username.toLowerCase(),
    ]);

    const user = result.rows[0];
    if (!user)
      return res.status(401).json({ error: "Қате логин немесе құпия сөз" });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid)
      return res.status(401).json({ error: "Қате логин немесе құпия сөз" });

    const token = jwt.sign(
      { id: user.id, username: user.username },
      SECRET_KEY,
      {
        expiresIn: "1h",
      }
    );

    res.json({ token });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "login қате болды" });
  }
});

app.get("/profile", authMiddleware, async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!token) return res.status(401).json({ error: "unaythirized" });

  const token = authHeader.split(" ")[1];
  try {
    const code = jwt.verify(token);
    req.user = code;
    next();
    res.json({ message: `welcome, ${req.user.username}` });
  } catch (error) {
    res.status(403).json({ error: "forbidden" });
  }
});

app.listen(3000, () => {
  console.log(`Сервер http://localhost:3000 портында жұмыс істеуде`);
});
