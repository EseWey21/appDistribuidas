require("dotenv").config();
const express = require("express");
const { MongoClient, ServerApiVersion } = require("mongodb");

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

let proyectosCollection;

// Tres formas de mandar datos a un servicio

app.get("/serv001", (req, res) => {
  const { id, token, geo } = req.query;
  res.json({ user_id: id, token, geo });
});

app.post("/serv002", (req, res) => {
  const { id, token, geo } = req.body;
  res.json({ user_id: id, token, geo });
});

app.post("/serv003/:info", (req, res) => {
  res.json({ info: req.params.info });
});

// Inserción dinámica de proyectos

app.post("/receipt/insert", async (req, res) => {
  const { nombre, descripcion, autores, asesores, presupuesto } = req.body;

  if (
    typeof nombre !== "string" ||
    typeof descripcion !== "string" ||
    !Array.isArray(autores) ||
    !Array.isArray(asesores) ||
    typeof presupuesto !== "number"
  ) {
    return res.status(400).json({
      error: "nombre (string), descripcion (string), autores (array), asesores (array) y presupuesto (number) son requeridos",
    });
  }

  try {
    const resultado = await proyectosCollection.insertOne({
      nombre,
      descripcion,
      autores,
      asesores,
      presupuesto,
    });
    res.json({ insertedId: resultado.insertedId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

async function start() {
  const uri = process.env.MONGO_URI;
  const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
  });

  await client.connect();
  const db = client.db("myDatabaseProyectos");
  proyectosCollection = db.collection("proyectos");
  console.log("Conectado a MongoDB Atlas (myDatabaseProyectos.proyectos).");

  app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
  });
}

start();
