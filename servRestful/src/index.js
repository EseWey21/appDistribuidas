const express = require("express");

const stringsRoutes = require("./routes/strings.routes");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ ok: true, message: "API running" });
});

// Prefijo /api para todos los servicios
app.use("/api", stringsRoutes);

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
