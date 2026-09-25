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

    const { databases } = await client.db().admin().listDatabases();
    console.log("Bases de datos disponibles:");
    databases.forEach((db) => console.log(`- ${db.name}`));

    const db = client.db("sample_mflix");

    console.log("\n5 documentos de 'comments' (con proyección):");
    const comments = await db
      .collection("comments")
      .find({}, { projection: { _id: 1, name: 1, email: 1, movie_id: 1, text: 1 } })
      .limit(5)
      .toArray();
    comments.forEach((doc) => console.log(JSON.stringify(doc, null, 4)));

    console.log("\n5 documentos de 'embedded_movies' (con proyección):");
    const movies = await db
      .collection("embedded_movies")
      .find({}, { projection: { _id: 1, title: 1, year: 1, runtime: 1, comments: 1 } })
      .limit(5)
      .toArray();
    movies.forEach((doc) => console.log(JSON.stringify(doc, null, 4)));
  } catch (error) {
    console.error("Error en las consultas:", error.message);
  } finally {
    await client.close();
  }
}

run();
