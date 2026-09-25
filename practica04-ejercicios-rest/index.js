const express = require("express");

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

function respuesta(res, estado, data) {
  return res.status(estado ? 200 : 400).json(data);
}

// 1. Saludo
app.post("/saludo", (req, res) => {
  const { nombre } = req.body;
  if (typeof nombre !== "string" || nombre.trim() === "") {
    return respuesta(res, false, { error: "nombre es requerido" });
  }
  respuesta(res, true, { mensaje: `Hola, ${nombre}` });
});

// 2. Calculadora
app.post("/calcular", (req, res) => {
  const { a, b, operacion } = req.body;
  const operacionesValidas = ["suma", "resta", "multiplicacion", "division"];

  if (typeof a !== "number" || typeof b !== "number") {
    return respuesta(res, false, { error: "a y b deben ser números" });
  }
  if (!operacionesValidas.includes(operacion)) {
    return respuesta(res, false, { error: "operacion debe ser suma, resta, multiplicacion o division" });
  }
  if (operacion === "division" && b === 0) {
    return respuesta(res, false, { error: "no se puede dividir entre cero" });
  }

  const resultados = {
    suma: a + b,
    resta: a - b,
    multiplicacion: a * b,
    division: a / b,
  };

  respuesta(res, true, { a, b, operacion, resultado: resultados[operacion] });
});

// 3. CRUD de tareas en memoria
let tareas = [];

app.post("/tareas", (req, res) => {
  const { id, titulo, completada } = req.body;
  if (typeof id !== "number" || typeof titulo !== "string" || typeof completada !== "boolean") {
    return respuesta(res, false, { error: "id (number), titulo (string) y completada (boolean) son requeridos" });
  }
  if (tareas.some((t) => t.id === id)) {
    return respuesta(res, false, { error: "ya existe una tarea con ese id" });
  }
  const tarea = { id, titulo, completada };
  tareas.push(tarea);
  respuesta(res, true, { tarea });
});

app.get("/tareas", (req, res) => {
  respuesta(res, true, { tareas });
});

app.put("/tareas/:id", (req, res) => {
  const id = parseInt(req.params.id, 10);
  const tarea = tareas.find((t) => t.id === id);
  if (!tarea) {
    return respuesta(res, false, { error: "tarea no encontrada" });
  }
  const { titulo, completada } = req.body;
  if (titulo !== undefined) tarea.titulo = titulo;
  if (completada !== undefined) tarea.completada = completada;
  respuesta(res, true, { tarea });
});

app.delete("/tareas/:id", (req, res) => {
  const id = parseInt(req.params.id, 10);
  const indice = tareas.findIndex((t) => t.id === id);
  if (indice === -1) {
    return respuesta(res, false, { error: "tarea no encontrada" });
  }
  const [eliminada] = tareas.splice(indice, 1);
  respuesta(res, true, { eliminada });
});

// 4. Validar password
app.post("/validar-password", (req, res) => {
  const { password } = req.body;
  if (typeof password !== "string") {
    return respuesta(res, false, { error: "password es requerido" });
  }

  const errores = [];
  if (password.length < 8) errores.push("Debe tener al menos 8 caracteres");
  if (!/[A-Z]/.test(password)) errores.push("Debe tener al menos una mayúscula");
  if (!/[a-z]/.test(password)) errores.push("Debe tener al menos una minúscula");
  if (!/[0-9]/.test(password)) errores.push("Debe tener al menos un número");

  respuesta(res, true, { esValida: errores.length === 0, errores });
});

// 5. Convertir temperatura (siempre pasando por Celsius)
function aCelsius(valor, desde) {
  if (desde === "C") return valor;
  if (desde === "F") return ((valor - 32) * 5) / 9;
  if (desde === "K") return valor - 273.15;
}

function desdeCelsius(celsius, hacia) {
  if (hacia === "C") return celsius;
  if (hacia === "F") return (celsius * 9) / 5 + 32;
  if (hacia === "K") return celsius + 273.15;
}

app.post("/convertir-temperatura", (req, res) => {
  const { valor, desde, hacia } = req.body;
  const escalas = ["C", "F", "K"];

  if (typeof valor !== "number" || !escalas.includes(desde) || !escalas.includes(hacia)) {
    return respuesta(res, false, { error: "valor debe ser número y desde/hacia deben ser C, F o K" });
  }

  const celsius = aCelsius(valor, desde);
  const resultado = desdeCelsius(celsius, hacia);

  respuesta(res, true, { valor, desde, hacia, resultado });
});

// 6. Buscar en un arreglo
app.post("/buscar", (req, res) => {
  const { array, elemento } = req.body;
  if (!Array.isArray(array)) {
    return respuesta(res, false, { error: "array debe ser un arreglo" });
  }

  const indice = array.findIndex((item) => item === elemento);
  respuesta(res, true, {
    encontrado: indice !== -1,
    indice,
    tipoElemento: typeof elemento,
  });
});

// 7. Contar palabras
app.post("/contar-palabras", (req, res) => {
  const { texto } = req.body;
  if (typeof texto !== "string") {
    return respuesta(res, false, { error: "texto debe ser una cadena de texto" });
  }

  const palabras = texto.trim().split(/\s+/).filter(Boolean);
  const palabrasUnicas = new Set(palabras.map((p) => p.toLowerCase()));

  respuesta(res, true, {
    totalPalabras: palabras.length,
    totalCaracteres: texto.length,
    palabrasUnicas: palabrasUnicas.size,
  });
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
