const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// ----------------------------
// Utilidades
// ----------------------------
const isFiniteNumber = (n) => typeof n === "number" && Number.isFinite(n);

// ----------------------------
// 1) POST /saludo
// ----------------------------
app.post("/saludo", (req, res) => {
  const { nombre } = req.body ?? {};
  if (typeof nombre !== "string" || nombre.trim().length === 0) {
    return res.status(400).json({ estado: false, error: "El campo 'nombre' debe ser un string no vacío" });
  }
  return res.json({ estado: true, mensaje: `Hola, ${nombre.trim()}` });
});

// ----------------------------
// 2) POST /calcular
// ----------------------------
app.post("/calcular", (req, res) => {
  const { a, b, operacion } = req.body ?? {};

  if (!isFiniteNumber(a) || !isFiniteNumber(b)) {
    return res.status(400).json({ estado: false, error: "Los campos 'a' y 'b' deben ser números válidos" });
  }
  if (typeof operacion !== "string") {
    return res.status(400).json({ estado: false, error: "El campo 'operacion' debe ser string" });
  }

  let resultado;
  switch (operacion) {
    case "suma":
      resultado = a + b;
      break;
    case "resta":
      resultado = a - b;
      break;
    case "multiplicacion":
      resultado = a * b;
      break;
    case "division":
      if (b === 0) return res.status(400).json({ estado: false, error: "No se puede dividir entre cero" });
      resultado = a / b;
      break;
    default:
      return res.status(400).json({
        estado: false,
        error: "Operación inválida. Usa: suma|resta|multiplicacion|division"
      });
  }

  return res.json({ estado: true, resultado });
});

// ----------------------------
// 3) CRUD Tareas (en memoria)
// ----------------------------
const tareas = []; // { id:number, titulo:string, completada:boolean }

// POST /tareas
app.post("/tareas", (req, res) => {
  const { id, titulo, completada } = req.body ?? {};

  if (!isFiniteNumber(id) || !Number.isInteger(id) || id < 0) {
    return res.status(400).json({ estado: false, error: "El 'id' debe ser entero >= 0" });
  }
  if (typeof titulo !== "string" || titulo.trim().length === 0) {
    return res.status(400).json({ estado: false, error: "El 'titulo' debe ser string no vacío" });
  }
  if (typeof completada !== "boolean") {
    return res.status(400).json({ estado: false, error: "'completada' debe ser boolean" });
  }
  if (tareas.some((t) => t.id === id)) {
    return res.status(409).json({ estado: false, error: "Ya existe una tarea con ese id" });
  }

  const nueva = { id, titulo: titulo.trim(), completada };
  tareas.push(nueva);
  return res.status(201).json({ estado: true, tarea: nueva });
});

// GET /tareas
app.get("/tareas", (req, res) => {
  return res.json({ estado: true, tareas });
});

// PUT /tareas/:id
app.put("/tareas/:id", (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id < 0) return res.status(400).json({ estado: false, error: "Parámetro id inválido" });

  const tarea = tareas.find((t) => t.id === id);
  if (!tarea) return res.status(404).json({ estado: false, error: "Tarea no encontrada" });

  const { titulo, completada } = req.body ?? {};

  if (titulo !== undefined) {
    if (typeof titulo !== "string" || titulo.trim().length === 0) {
      return res.status(400).json({ estado: false, error: "Si envías 'titulo', debe ser string no vacío" });
    }
    tarea.titulo = titulo.trim();
  }
  if (completada !== undefined) {
    if (typeof completada !== "boolean") {
      return res.status(400).json({ estado: false, error: "Si envías 'completada', debe ser boolean" });
    }
    tarea.completada = completada;
  }

  return res.json({ estado: true, tarea });
});

// DELETE /tareas/:id
app.delete("/tareas/:id", (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id < 0) return res.status(400).json({ estado: false, error: "Parámetro id inválido" });

  const idx = tareas.findIndex((t) => t.id === id);
  if (idx === -1) return res.status(404).json({ estado: false, error: "Tarea no encontrada" });

  const eliminada = tareas.splice(idx, 1)[0];
  return res.json({ estado: true, tarea: eliminada });
});

// ----------------------------
// 4) POST /validar-password
// ----------------------------
app.post("/validar-password", (req, res) => {
  const { password } = req.body ?? {};
  if (typeof password !== "string") {
    return res.status(400).json({ estado: false, error: "El campo 'password' debe ser string" });
  }

  const errores = [];
  if (password.length < 8) errores.push("Debe tener mínimo 8 caracteres");
  if (!/[A-Z]/.test(password)) errores.push("Debe tener al menos una mayúscula");
  if (!/[a-z]/.test(password)) errores.push("Debe tener al menos una minúscula");
  if (!/[0-9]/.test(password)) errores.push("Debe tener al menos un número");

  return res.json({ estado: true, esValida: errores.length === 0, errores });
});

// ----------------------------
// 5) POST /convertir-temperatura
// ----------------------------
const toCelsius = (valor, desde) => {
  switch (desde) {
    case "C": return valor;
    case "F": return (valor - 32) * (5 / 9);
    case "K": return valor - 273.15;
  }
};

const fromCelsius = (c, hacia) => {
  switch (hacia) {
    case "C": return c;
    case "F": return c * (9 / 5) + 32;
    case "K": return c + 273.15;
  }
};

app.post("/convertir-temperatura", (req, res) => {
  const { valor, desde, hacia } = req.body ?? {};

  if (!isFiniteNumber(valor)) return res.status(400).json({ estado: false, error: "'valor' debe ser number válido" });
  if (!["C", "F", "K"].includes(desde)) return res.status(400).json({ estado: false, error: "'desde' debe ser C|F|K" });
  if (!["C", "F", "K"].includes(hacia)) return res.status(400).json({ estado: false, error: "'hacia' debe ser C|F|K" });

  const c = toCelsius(valor, desde);
  const convertido = fromCelsius(c, hacia);

  return res.json({
    estado: true,
    valorOriginal: valor,
    valorConvertido: convertido,
    escalaOriginal: desde,
    escalaConvertida: hacia
  });
});

// ----------------------------
// 6) POST /buscar
// ----------------------------
app.post("/buscar", (req, res) => {
  const { array, elemento } = req.body ?? {};
  if (!Array.isArray(array)) return res.status(400).json({ estado: false, error: "'array' debe ser un arreglo" });

  const indice = array.findIndex((x) => Object.is(x, elemento));
  const encontrado = indice !== -1;
  const tipoElemento = elemento === null ? "null" : typeof elemento;

  return res.json({ estado: true, encontrado, indice, tipoElemento });
});

// ----------------------------
// 7) POST /contar-palabras
// ----------------------------
app.post("/contar-palabras", (req, res) => {
  const { texto } = req.body ?? {};
  if (typeof texto !== "string") return res.status(400).json({ estado: false, error: "'texto' debe ser string" });

  const totalCaracteres = texto.length;
  const trimmed = texto.trim();

  if (trimmed.length === 0) {
    return res.json({ estado: true, totalPalabras: 0, totalCaracteres, palabrasUnicas: 0 });
  }

  const palabras = trimmed.split(/\s+/).filter(Boolean);
  const totalPalabras = palabras.length;
  const palabrasUnicas = new Set(palabras.map((w) => w.toLowerCase())).size;

  return res.json({ estado: true, totalPalabras, totalCaracteres, palabrasUnicas });
});

// ----------------------------
// 404
// ----------------------------
app.use((req, res) => {
  res.status(404).json({ estado: false, error: "Ruta no encontrada" });
});

// ----------------------------
// Iniciar servidor
// ----------------------------
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`API corriendo en http://localhost:${PORT}`));