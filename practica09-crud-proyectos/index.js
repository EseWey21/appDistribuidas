require("dotenv").config();
const express = require("express");
const { MongoClient, ServerApiVersion } = require("mongodb");

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

let proyectosCollection;

app.post("/receipt/insert", async (req, res) => {
  const { id, nombre, descripcion, autores, asesores, presupuesto } = req.body;

  if (
    typeof id !== "string" ||
    typeof nombre !== "string" ||
    typeof descripcion !== "string" ||
    !Array.isArray(autores) ||
    !Array.isArray(asesores) ||
    typeof presupuesto !== "number"
  ) {
    return res.status(400).json({
      error: "id, nombre, descripcion (string), autores, asesores (array) y presupuesto (number) son requeridos",
    });
  }

  try {
    const resultado = await proyectosCollection.insertOne({
      id,
      nombre,
      descripcion,
      autores,
      asesores,
      presupuesto,
      deleted: false,
    });
    res.json({ insertedId: resultado.insertedId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/receipt/get", async (req, res) => {
  try {
    const proyectos = await proyectosCollection.find({ deleted: false }).toArray();
    res.json({ proyectos });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put("/receipt/update/:id", async (req, res) => {
  try {
    const resultado = await proyectosCollection.updateOne(
      { id: req.params.id },
      { $set: req.body }
    );
    if (resultado.matchedCount === 0) {
      return res.status(404).json({ error: "no encontrado" });
    }
    res.json({ matchedCount: resultado.matchedCount, modifiedCount: resultado.modifiedCount });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete("/receipt/delete/:id", async (req, res) => {
  try {
    const resultado = await proyectosCollection.deleteOne({ id: req.params.id });
    if (resultado.deletedCount === 0) {
      return res.status(404).json({ error: "no encontrado" });
    }
    res.json({ deletedCount: resultado.deletedCount });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put("/receipt/delete/:id", async (req, res) => {
  try {
    const resultado = await proyectosCollection.updateOne(
      { id: req.params.id },
      { $set: { deleted: true } }
    );
    if (resultado.matchedCount === 0) {
      return res.status(404).json({ error: "no encontrado" });
    }
    res.json({ matchedCount: resultado.matchedCount, modifiedCount: resultado.modifiedCount });
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
