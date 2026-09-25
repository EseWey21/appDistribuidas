const express = require("express");
const crypto = require("crypto");

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

function isString(value) {
  return typeof value === "string";
}

function isPalindrome(text) {
  const normalizado = text.toLowerCase().replace(/\s+/g, "");
  return normalizado === normalizado.split("").reverse().join("");
}

function sha256(text) {
  return crypto.createHash("sha256").update(text).digest("hex");
}

app.post("/mascaracteres", (req, res) => {
  const { a, b } = req.body;
  if (!isString(a) || !isString(b)) {
    return res.status(400).json({ ok: false, error: "a y b deben ser cadenas de texto" });
  }
  const mayor = a.length >= b.length ? a : b;
  res.json({ ok: true, a, b, mayor });
});

app.post("/menoscaracteres", (req, res) => {
  const { a, b } = req.body;
  if (!isString(a) || !isString(b)) {
    return res.status(400).json({ ok: false, error: "a y b deben ser cadenas de texto" });
  }
  const menor = a.length <= b.length ? a : b;
  res.json({ ok: true, a, b, menor });
});

app.post("/numcaracteres", (req, res) => {
  const { text } = req.body;
  if (!isString(text)) {
    return res.status(400).json({ ok: false, error: "text debe ser una cadena de texto" });
  }
  res.json({ ok: true, text, length: text.length });
});

app.post("/palindroma", (req, res) => {
  const { text } = req.body;
  if (!isString(text)) {
    return res.status(400).json({ ok: false, error: "text debe ser una cadena de texto" });
  }
  res.json({ ok: true, text, isPalindrome: isPalindrome(text) });
});

app.post("/concat", (req, res) => {
  const { a, b } = req.body;
  if (!isString(a) || !isString(b)) {
    return res.status(400).json({ ok: false, error: "a y b deben ser cadenas de texto" });
  }
  res.json({ ok: true, a, b, resultado: a + b });
});

app.post("/applysha256", (req, res) => {
  const { text } = req.body;
  if (!isString(text)) {
    return res.status(400).json({ ok: false, error: "text debe ser una cadena de texto" });
  }
  res.json({ ok: true, original: text, sha256: sha256(text) });
});

app.post("/verifysha256", (req, res) => {
  const { plain, hash } = req.body;
  if (!isString(plain) || !isString(hash)) {
    return res.status(400).json({ ok: false, error: "plain y hash deben ser cadenas de texto" });
  }
  res.json({ ok: true, matches: sha256(plain) === hash.toLowerCase() });
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
