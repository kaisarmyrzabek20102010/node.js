const express = require('express');
const app = express();

app.use(express.static('public'));

app.use((req, res) => {
    res.status(404).json({ error: "tabylamdy" });
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Сервер http://localhost:${PORT} адресінде жұмыс істеп тұр`);
});