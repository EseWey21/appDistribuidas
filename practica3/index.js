require("dotenv").config();
const mongoose = require("mongoose");

async function listDatabases() {
  // En Mongoose puedes acceder al driver nativo así:
  const adminDb = mongoose.connection.db.admin();
  const databasesList = await adminDb.listDatabases();

  console.log("Databases:");
  databasesList.databases.forEach((db) => console.log(` - ${db.name}`));
}

async function main() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.error("❌ Falta MONGODB_URI en el archivo .env");
    process.exit(1);
  }

  try {
    await mongoose.connect(uri);
    console.log("✅ Conexión exitosa a MongoDB");

    await listDatabases(); // <- equivalente a tu recoverdb.js

  } catch (err) {
    console.error("❌ Error:", err.message);
    process.exit(1);
  }
}

main();

// Cierre limpio al salir (Ctrl+C)
process.on("SIGINT", async () => {
  await mongoose.connection.close();
  console.log("\n🔌 Conexión cerrada");
  process.exit(0);
});