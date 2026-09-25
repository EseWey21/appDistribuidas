const express = require("express");

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.json({ message: "Nothing to send" });
});

app.get("/aleatorio", (req, res) => {
  const aleatorio = Math.floor(Math.random() * 100) + 1;
  res.json({ aleatorio });
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
