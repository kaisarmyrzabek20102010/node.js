const express = require("express");
const app = express();
app.use(express.json());

let cars = [
  { id: 1, brand: "Mercedes", model: "benz", year: 1874, color: "qara", baga: 20000 },
  { id: 2, brand: "Toyota", model: "Camry", year: 2119, color: "aq", baga: 15000 }
];

let nextId = 3;

app.post("/cars", (req, res) => {
  const { brand, model, year, color, baga } = req.body;
  const newCar = { id: nextId++, brand, model, year, color, baga };
  cars.push(newCar);
  res.status(201).json(newCar);
});

app.get("/", (req, res) => {
  res.json(cars);
});

app.get("/car/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const car = cars.find(c => c.id === id);
  res.json(car);
});

app.get("/car/search", (req, res) => {
  const { brand } = req.query;
  const result = cars.filter(c => c.brand.toLowerCase() === brand.toLowerCase());
  res.json(result);
});

app.put("/update/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const { brand } = req.body;
  const car = cars.find(c => c.id === id);
  car.brand = brand;
  res.json(car);
});

app.delete("/delete/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const index = cars.findIndex(c => c.id === id);
  const deleted = cars.splice(index, 1);
  res.json(deleted[0]);
});

app.listen(3000, () => {
  console.log(`server uryp tyr`);
});
