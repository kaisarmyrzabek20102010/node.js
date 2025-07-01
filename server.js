const express = require("express");
const { Pool } = require("pg");
const app = express();
const cors = require("cors");

app.post("/addcar", async (req, res) => {
  const { brand, model, price, year } = req.body;

  if (!brand || !model || !price || !year) {
    return res.status(400).json({ error: "pustoi " });
  }

  try {
    const result = await pool.query(
      "INSERT INTO cars (brand, model, price, year) VALUES ($1, $2, $3, $4)",
      [brand, model, price, year]
    );
    res.send({ message: "car aosildy" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "qate" });
  }
});

app.get("/cars", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM cars");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "qate" });
  }
});

app.get("/car/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const result = await pool.query("SELECT * FROM cars WHERE id = $1", [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "tabylmady" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "qate" });
  }
});

app.listen(3000, () => {
  console.log("Server uryp tyr");
});
