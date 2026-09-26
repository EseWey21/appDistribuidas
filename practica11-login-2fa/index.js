require("dotenv").config();
const express = require("express");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const { MongoClient, ServerApiVersion } = require("mongodb");

const app = express();
const PORT = 3000;
const PIN_TTL_MS = 3 * 60 * 1000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

let usuariosCollection;
let transporter;

function hashPassword(password) {
  return crypto.createHash("sha256").update(password).digest("hex");
}

function generarPin() {
  return crypto.randomInt(100000, 1000000).toString();
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
      pin: null,
      pinExpira: null,
    });
    res.json({ insertedId: resultado.insertedId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/receipt/login/step1", async (req, res) => {
  const { id, password } = req.body;

  if (typeof id !== "string" || typeof password !== "string") {
    return res.status(400).json({ error: "id y password (string) son requeridos" });
  }

  try {
    const usuario = await usuariosCollection.findOne({ id });
    if (!usuario || usuario.password !== hashPassword(password)) {
      return res.status(401).json({ ok: false, error: "credenciales inválidas" });
    }

    const pin = generarPin();
    const pinExpira = new Date(Date.now() + PIN_TTL_MS);

    await usuariosCollection.updateOne({ id }, { $set: { pin, pinExpira } });

    await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to: usuario.email,
      subject: "Tu PIN de verificación",
      text: `Tu PIN de verificación es: ${pin}\nExpira en 3 minutos.`,
    });

    res.json({ ok: true, message: "PIN enviado al correo registrado" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/receipt/login/step2", async (req, res) => {
  const { id, pin } = req.body;

  if (typeof id !== "string" || typeof pin !== "string") {
    return res.status(400).json({ error: "id y pin (string) son requeridos" });
  }

  try {
    const usuario = await usuariosCollection.findOne({ id });

    if (!usuario || !usuario.pin || !usuario.pinExpira) {
      return res.status(401).json({ ok: false, error: "no hay un PIN pendiente para este usuario" });
    }

    if (new Date() > new Date(usuario.pinExpira)) {
      await usuariosCollection.updateOne({ id }, { $set: { pin: null, pinExpira: null } });
      return res.status(401).json({ ok: false, error: "PIN expirado" });
    }

    if (usuario.pin !== pin) {
      return res.status(401).json({ ok: false, error: "PIN incorrecto" });
    }

    await usuariosCollection.updateOne({ id }, { $set: { pin: null, pinExpira: null } });
    res.json({ ok: true, message: "login completo" });
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
  usuariosCollection = db.collection("UsuariosLoginDosPasos");
  console.log("Conectado a MongoDB Atlas (myDatabaseProyectos.UsuariosLoginDosPasos).");

  transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASS,
    },
  });

  app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
  });
}

start();
