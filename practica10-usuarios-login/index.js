require("dotenv").config();
const express = require("express");
const crypto = require("crypto");
const { MongoClient, ServerApiVersion } = require("mongodb");

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

let usuariosCollection;

function hashPassword(password) {
  return crypto.createHash("sha256").update(password).digest("hex");
}

app.post("/receipt/insert", async (req, res) => {
  const { id, nombre, email, password } = req.body;

  if (
    typeof id !== "string" ||
    typeof nombre !== "string" ||
    typeof email !== "string" ||
    typeof password !== "string"
  ) {
    return res.status(400).json({
      error: "id, nombre, email y password (string) son requeridos",
    });
  }

  try {
    const resultado = await usuariosCollection.insertOne({
      id,
      nombre,
      email,
      password: hashPassword(password),
    });
    res.json({ insertedId: resultado.insertedId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/receipt/get", async (req, res) => {
  try {
    const usuarios = await usuariosCollection
      .find({}, { projection: { password: 0 } })
      .toArray();
    res.json({ usuarios });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put("/receipt/update/:id", async (req, res) => {
  try {
    const cambios = { ...req.body };
    if (typeof cambios.password === "string") {
      cambios.password = hashPassword(cambios.password);
    }

    const resultado = await usuariosCollection.updateOne(
      { id: req.params.id },
      { $set: cambios }
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
    const resultado = await usuariosCollection.deleteOne({ id: req.params.id });
    if (resultado.deletedCount === 0) {
      return res.status(404).json({ error: "no encontrado" });
    }
    res.json({ deletedCount: resultado.deletedCount });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/receipt/login", async (req, res) => {
  const { id, password } = req.body;

  if (typeof id !== "string" || typeof password !== "string") {
    return res.status(400).json({ error: "id y password (string) son requeridos" });
  }

  try {
    const usuario = await usuariosCollection.findOne({ id });
    if (!usuario || usuario.password !== hashPassword(password)) {
      return res.status(401).json({ ok: false, error: "credenciales inválidas" });
    }
    res.json({ ok: true });
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
  usuariosCollection = db.collection("Usuarios");
  console.log("Conectado a MongoDB Atlas (myDatabaseProyectos.Usuarios).");

  app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
  });
}

start();
