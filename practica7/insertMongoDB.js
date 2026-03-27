const express = require("express");
const { MongoClient } = require("mongodb");

const app = express();
app.use(express.json());

// Puerto del servidor
const PORT = 3000;

// URI de conexión a MongoDB Atlas
// Reemplaza TU_PASSWORD_AQUI por tu contraseña real
const uri = "mongodb+srv://sajitlove2002_db_user:V7TGeNKaSqnfaIzD@cluster0.m2sskii.mongodb.net/practica7?retryWrites=true&w=majority&appName=Cluster0";

// Crear cliente Mongo
const client = new MongoClient(uri, {
  serverSelectionTimeoutMS: 10000,
  connectTimeoutMS: 10000,
});

let db;

// Función para conectar a la base de datos
async function connectDB() {
  try {
    await client.connect();
    console.log("Conectado correctamente a MongoDB Atlas");

    // Selecciona la base de datos
    db = client.db("practica7");
  } catch (error) {
    console.error("No se pudo iniciar la aplicación:", error.message);
    process.exit(1);
  }
}

// Ruta de prueba
app.get("/", (req, res) => {
  res.send("Servidor funcionando correctamente");
});

// Ruta para insertar un documento
app.post("/insertar", async (req, res) => {
  try {
    const datos = req.body;

    // Validación básica
    if (!datos || Object.keys(datos).length === 0) {
      return res.status(400).json({
        mensaje: "Debes enviar un JSON con datos para insertar",
      });
    }

    const resultado = await db.collection("registros").insertOne(datos);

    res.status(201).json({
      mensaje: "Documento insertado correctamente",
      id: resultado.insertedId,
      documento: datos,
    });
  } catch (error) {
    console.error("Error al insertar:", error.message);
    res.status(500).json({
      mensaje: "Error al insertar documento",
      error: error.message,
    });
  }
});

// Servicio requerido en la practica: inserta multiples recetas recibidas por body
app.post("/receipt/insert", async (req, res) => {
  try {
    const recipes = req.body.recipes;

    if (!Array.isArray(recipes) || recipes.length === 0) {
      return res.status(400).json({
        mensaje:
          "Invalid payload. Send a non-empty array in body field 'recipes'.",
      });
    }

    const resultado = await db.collection("recipes").insertMany(recipes);

    return res.status(201).json({
      result: `${resultado.insertedCount} documents successfully inserted.`,
      insertedCount: resultado.insertedCount,
      insertedIds: resultado.insertedIds,
    });
  } catch (error) {
    console.error("Error al insertar recipes:", error.message);
    return res.status(500).json({
      mensaje: "Error al insertar recipes",
      error: error.message,
    });
  }
});

// Ruta para consultar todos los documentos
app.get("/registros", async (req, res) => {
  try {
    const documentos = await db.collection("recipes").find({}).toArray();

    res.status(200).json(documentos);
  } catch (error) {
    console.error("Error al consultar registros:", error.message);
    res.status(500).json({
      mensaje: "Error al consultar registros",
      error: error.message,
    });
  }
});

// Conectar a Mongo y arrancar servidor
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
  });
});