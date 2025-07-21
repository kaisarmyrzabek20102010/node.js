const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const { PORT } = require("./node.js/config/env");
const { authMIddleware, errorHAndler, Limiter } = require("./node.js/middleware/auth");
const authRoutes = require("./node.js/routes/authRoutes");

const app = express();

app.use(express.json());
app.use(cors());
app.use(helmet());
app.use('/api',Limiter) 
app.use("/api", authRoutes);

app.use('/api/secure',authMIddleware, (req, res) => {
  res.send('👍🏿👍🏿');
});

app.use(errorHAndler)

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});