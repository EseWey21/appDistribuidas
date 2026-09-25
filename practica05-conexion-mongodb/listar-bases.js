require("dotenv").config();
const { MongoClient, ServerApiVersion } = require("mongodb");

const uri = process.env.MONGO_URI;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();
    const resultado = await client.db().admin().listDatabases();
    console.log("Bases de datos en el clúster:");
    resultado.databases.forEach((db) => {
      console.log(`- ${db.name}`);
    });
  } catch (error) {
    console.error("Error al listar bases de datos:", error.message);
  } finally {
    await client.close();
  }
}

run();
