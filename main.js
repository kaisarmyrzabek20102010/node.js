const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.static('public'));

app.use((req, res) => {
  res.status(404).json({
    status: 404,
    message: "sorry server doesnt find"
  });
});

app.listen(PORT, () => {
  console.log(`Сервер жұмыс істеп тұр: http://localhost:${PORT}`);
});
