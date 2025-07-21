const pool = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config/env");

exports.register = async (req, res, next) => {
  const { username, password } = req.body;

  try {
    const hashed = await bcrypt.hash(password, 10);
    await pool.query(
      "insert into users (username, password) values ($1, $2)",
      [username, hashed]
    );
    res.status(201).send("user registr jasady");
  } catch (error) {
    console.log("👎🏿👎🏿👎🏿", error);
    next(error);
  }
};

exports.login = async (req, res, next) => {
  const { username, password } = req.body;

  try {
    const result = await pool.query(
      "select * from users where username = $1",
      [username]
    );
    const user = result.rows[0];

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).send("dyris jazte");
    }

    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: "1h" });
    res.json({ token });
  } catch (error) {
    console.log("👎🏿👎🏿👎🏿", error);
    next(error);
  }
};

exports.addtort = async (req, res, next) => {
  const { name, price, description } = req.body;

  try {
   const result = await pool.query(
      "insert into torts (name, price, description) values ($1, $2, $3)",
      [name, price, description]
    );
    res.status(201).send("👍🏿👍🏿👍🏿");
    res.stattus(200).json(result.rows)
  } catch (error) {
    console.log("👎🏿👎🏿👎🏿", error);
    next(error);
  }
};

exports.gettort = async (req, res, next) => {
  try {
    const result = await pool.query("select * from torts");
    res.status(200).json(result.rows);
  } catch (error) {
    console.log("👎🏿👎🏿👎🏿", error);
    next(error);
  }
};

exports.updatetort = async (req, res, next) => {
  const { id, name, price, description } = req.body;

  try {
    await pool.query(
      "update torts set name = $1, price = $2, description = $3 where id = $4",
      [name, price, description, id]
    );
    res.status(200).send("👍🏿👍🏿👍🏿");
  } catch (error) {
    console.log("👎🏿👎🏿👎🏿", error);
    next(error);
  }
};

exports.deltort = async (req, res, next) => {
  const { id } = req.params;

  try {
    await pool.query("delete from torts where id = $1", [id]);
    res.status(200).send("👍🏿👍🏿👍🏿");
  } catch (error) {
    console.log("👎🏿👎🏿👎🏿", error);
    next(error);
  }
};
