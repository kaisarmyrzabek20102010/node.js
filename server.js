// const express = require("express");
// const jwt = require("jsonwebtoken");
// const bcrypt = require("bcrypt");
// const pool = require("./db"); // Assuming you have a db.js file that exports a configured pool
// const cors = require("cors");

// const app = express();
// app.use(express.json());
// app.use(cors());

// const secret_key = "akjdsadsa";

// function verifyToken(req, res, next) {
//   const authHeader = req.headers["authorization"];

//   if (!authHeader)
//     return res.status(401).json({ message: "No token provided" });

//   const token = authHeader.split("")[1];

//   try {
//     const user = jwt.verify(token, secret_key);
//     req.user = user;
//     next();
//   } catch (error) {
//     res.status(403).json({ message: "Invalid token" });
//   }
// }

// app.post("/register", async (req, res) => {
//   const { username, password } = req.body;

//   try {
//     const userCheck = await pool.query(
//       "SELECT * FROM users WHERE username =$1",
//       [username]
//     );

//     if (userCheck.rows.length > 0) {
//       return res.status(400).json({ message: "User already exists" });
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);
//     const result = await pool.query(
//       "INSERT INTO users (username, password) VALUES ($1, $2) RETURNING id,username",
//       [username, hashedPassword]
//     );

//     res.status(201).json({
//       message: "User registered successfully",
//       user: result.rows[0],
//     });
//   } catch (error) {
//     res.status(500).json({ message: "Error registering user" });
//   }
// });

// app.post("/login", async (req, res) => {
//   const { username, password } = req.body;
//   try {
//     const result = await pool.query("select * from users where username=$1", [
//       username,
//     ]);
//     const user = result.rows[0];

//     if (!user)
//       return res.status(400).json({ message: "Invalid username or password" });

//     const valid = await bcrypt.compare(password, user.password);
//     if (!valid)
//       return res.status(400).json({ message: "Invalid username or password" });

//     const token = jwt.sign(
//       { id: user.id, username: user.username },
//       secret_key,
//       {
//         expiresIn: "1h",
//       }
//     );
//     res.json({token});
//   } catch (error) {
//     res.status(500).json({ message: "Error logging in" });
//   }
// });

// app.get("/profile", verifyToken, async (req, res) => {
//   res.json({
//     message: `hello ${req.user.username}, this is your profile`,
//   });
// });

// app.get('/settings', verifyToken, async (req, res) => {
//   res.json({
//     message: "Settings data",
//     user: req.user,
//   });
// });

// app.listen(3002, () => {
//   console.log("Server is running on port 3000");
// });

const { Pool } = require("pg");
const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

require("dotenv").config();
const pool = new Pool({
  connectionString: process.env.DB_URL,
});

module.exports = pool;

const jwt = require("jsonwebtoken");

function authMiddleware(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

module.exports = authMiddleware;

const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require("../db");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register", async (req, res) => {
  const { username, email, password } = req.body;

  const userExists = await pool.query(
    "SELECT * FROM users WHERE username = $1 OR email = $2",
    [username, email]
  );
  if (userExists.rows.length > 0) {
    return res.status(400).json({ message: "User already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  await pool.query(
    "INSERT INTO users (username, email, password) VALUES ($1, $2, $3)",
    [username, email, hashedPassword]
  );

  res.status(201).json({ message: "User registered successfully" });
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const userResult = await pool.query("SELECT * FROM users WHERE email = $1", [
    email,
  ]);
  const user = userResult.rows[0];
  if (!user) return res.status(400).json({ message: "User not found" });

  const validPass = await bcrypt.compare(password, user.password);
  if (!validPass) return res.status(401).json({ message: "Invalid password" });

  const token = jwt.sign(
    { id: user.id, username: user.username },
    process.env.JWT_SECRET,
    {
      expiresIn: "1d",
    }
  );

  res.json({ token });
});

router.get("/profile", authMiddleware, async (req, res) => {
  const user = await pool.query(
    "SELECT id, username, email, created_at FROM users WHERE id = $1",
    [req.user.id]
  );
  res.json(user.rows[0]);
});

module.exports = router;

const authRoutes = require("./routes/auth");

app.use("/", authRoutes);


app.listen(3003, () => {
  console.log(`Server running on port ${PORT}`);
});
