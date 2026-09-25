const express = require("express");

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post("/fragmenta", (req, res) => {
  const { id, lat, long } = req.body;

  const latNum = parseFloat(lat);
  const longNum = parseFloat(long);

  const latEntero = Math.trunc(latNum);
  const latDecimal = Math.abs(latNum - latEntero);

  const longEntero = Math.trunc(longNum);
  const longDecimal = Math.abs(longNum - longEntero);

  res.json({
    id_e: id,
    lat_i_e: latEntero,
    lat_d_e: latDecimal,
    long_i_e: longEntero,
    long_d_e: longDecimal,
  });
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
