require("dotenv").config();
const express = require("express");
const { MongoClient, ServerApiVersion } = require("mongodb");

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

let recipesCollection;

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

// Inserción de una receta de ejemplo

app.post("/receipt/insert", async (req, res) => {
  const receta = {
    name: "Tacos al pastor",
    ingredients: ["tortillas de maíz", "carne de cerdo adobada", "piña", "cebolla", "cilantro"],
    prepTimeInMinutes: 40,
  };

  try {
    const resultado = await recipesCollection.insertMany([receta]);
    res.json({ insertedCount: resultado.insertedCount });
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
  const db = client.db("myDatabase");
  recipesCollection = db.collection("recipes");
  console.log("Conectado a MongoDB Atlas (myDatabase.recipes).");

  app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
  });
}

start();
