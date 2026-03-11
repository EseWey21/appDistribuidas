/**
 * ============================================================================
 * Práctica 7 – Aplicaciones Distribuidas
 * Servidor Express con conexión a MongoDB Atlas
 * ============================================================================
 *
 * Este archivo implementa un servidor web RESTful usando Express.js que se
 * conecta a una base de datos MongoDB Atlas. Expone varios endpoints (servicios)
 * que demuestran distintas formas de recibir y enviar datos:
 *   - Parámetros en query string (GET)
 *   - Parámetros en el body de la petición (POST con JSON)
 *   - Parámetros en la URL (POST con :param)
 *   - Inserción de documentos en MongoDB (POST)
 *
 * Dependencias:
 *   npm install express mongodb
 *
 * Ejecución:
 *   npm start          (o  node insertMongoDB.js)
 *
 * El servidor escucha en el puerto 3000.
 * ============================================================================
 */

// --- Importación de dependencias ---
var express = require("express");
var app = express(); // Contenedor de Endpoints / Web Services RESTful
const { MongoClient } = require("mongodb");

// --- Variables globales para la conexión a MongoDB ---
var client = 0; // Instancia del cliente de MongoDB
var dbName = ""; // Nombre de la base de datos
var collectionName = ""; // Nombre de la colección
var database = 0; // Referencia a la base de datos
var collection = 0; // Referencia a la colección

// --- Middleware ---
// Permite parsear cuerpos JSON en las peticiones entrantes
app.use(express.json());
// Permite parsear cuerpos con formato URL-encoded
app.use(express.urlencoded({ extended: true }));

/**
 * prepareDB()
 * Configura las referencias a la base de datos "myDatabase"
 * y a la colección "recipes" para poder ejecutar operaciones sobre ellas.
 */
function prepareDB() {
  dbName = "myDatabase";
  collectionName = "recipes";

  database = client.db(dbName);
  collection = database.collection(collectionName);
}

/**
 * connectDB()
 * Establece la conexión al clúster de MongoDB Atlas usando la URI proporcionada.
 * El método connect() configura la conexión; la conexión real se realiza
 * de forma perezosa cuando se ejecuta la primera operación.
 */
async function connectDB() {
  const uri =
    "mongodb+srv://nsierrar:HWw9svVIcm9mI3rz@cluster0.dgxsrgl.mongodb.net/?retryWrites=true&w=majority";

  client = new MongoClient(uri);
  await client.connect();
  console.log("Conexión a MongoDB Atlas establecida correctamente.");
}

// ============================================================================
// ENDPOINTS / SERVICIOS
// ============================================================================

/**
 * GET /
 * Endpoint raíz. Retorna un mensaje indicando que no hay datos que enviar.
 * Sirve como verificación de que el servidor está activo.
 */
app.get("/", async function (request, response) {
  const r = {
    message: "Nothing to send",
  };
  response.json(r);
});

/**
 * GET /serv001
 * Recibe datos a través de query params en la URL.
 *
 * Ejemplo de invocación:
 *   http://localhost:3000/serv001?id=Nope&token=2345678dhuj43567fgh&geo=123456789,1234567890
 *
 * @query {string} id    - Identificador del usuario
 * @query {string} token - Token de autenticación
 * @query {string} geo   - Coordenadas geográficas
 * @returns {object} JSON con los parámetros recibidos
 */
app.get("/serv001", async function (req, res) {
  const user_id = req.query.id;
  const token = req.query.token;
  const geo = req.query.geo;

  const r = {
    user_id: user_id,
    token: token,
    geo: geo,
  };

  res.json(r);
});

/**
 * GET /serv0010
 * Igual que /serv001. Recibe datos por query params.
 * Variante duplicada para demostración de múltiples endpoints GET.
 *
 * Ejemplo de invocación:
 *   http://localhost:3000/serv0010?id=Nope&token=2345678dhuj43567fgh&geo=123456789,1234567890
 *
 * @query {string} id    - Identificador del usuario
 * @query {string} token - Token de autenticación
 * @query {string} geo   - Coordenadas geográficas
 * @returns {object} JSON con los parámetros recibidos
 */
app.get("/serv0010", async function (req, res) {
  const user_id1 = req.query.id;
  const token1 = req.query.token;
  const geo1 = req.query.geo;

  const r1 = {
    user_id: user_id1,
    token: token1,
    geo: geo1,
  };

  res.json(r1);
});

/**
 * POST /serv002
 * Recibe datos en el body de la petición como JSON.
 *
 * Ejemplo de body (raw - JSON):
 *   {
 *       "id": "nope",
 *       "token": "ertydfg456Dfgwerty",
 *       "geo": "12345678,34567890"
 *   }
 *
 * @body {string} id    - Identificador del usuario
 * @body {string} token - Token de autenticación
 * @body {string} geo   - Coordenadas geográficas
 * @returns {object} JSON con los parámetros recibidos
 */
app.post("/serv002", async function (req, res) {
  const user_id = req.body.id;
  const token = req.body.token;
  const geo = req.body.geo;

  const r = {
    user_id: user_id,
    token: token,
    geo: geo,
  };

  res.json(r);
});

/**
 * POST /serv003/:info
 * Recibe un parámetro como parte de la ruta (URL param).
 *
 * Ejemplo de invocación:
 *   POST http://localhost:3000/serv003/1234567
 *
 * @param {string} info - Dato enviado directamente en la URL
 * @returns {object} JSON con el parámetro recibido
 */
app.post("/serv003/:info", async function (req, res) {
  const info = req.params.info;
  let r = { info: info };
  res.json(r);
});

/**
 * POST /receipt/insert
 * Inserta una o más recetas (recipes) en la colección "recipes" de MongoDB.
 *
 * *** MODIFICADO ***
 * Anteriormente los datos de las recetas estaban escritos directamente
 * en el código (hard-coded). Ahora se reciben como parámetro en el body
 * de la petición, permitiendo al cliente enviar cualquier receta.
 *
 * Ejemplo de body (raw - JSON):
 *   {
 *       "recipes": [
 *           {
 *               "name": "elotes cocidos",
 *               "ingredients": ["corn", "mayonnaise", "cotija cheese", "sour cream", "lime"],
 *               "prepTimeInMinutes": 35
 *           },
 *           {
 *               "name": "guacamole",
 *               "ingredients": ["avocado", "tomato", "onion", "cilantro", "lime", "salt"],
 *               "prepTimeInMinutes": 15
 *           }
 *       ]
 *   }
 *
 * @body {Array} recipes - Arreglo de objetos receta. Cada receta debe tener:
 *   - name {string}             : Nombre de la receta
 *   - ingredients {string[]}    : Lista de ingredientes
 *   - prepTimeInMinutes {number}: Tiempo de preparación en minutos
 * @returns {object} JSON con el resultado de la inserción
 */
app.post("/receipt/insert", async function (req, res) {
  // Los datos de las recetas ahora se reciben del body de la petición
  const recipes = req.body.recipes;

  // Validación: verificar que se envió el campo "recipes" y es un arreglo no vacío
  if (!recipes || !Array.isArray(recipes) || recipes.length === 0) {
    return res.status(400).json({
      result:
        "Error: Se debe enviar un arreglo 'recipes' en el body de la petición con al menos un elemento.",
    });
  }

  let result = "";

  try {
    const insertManyResult = await collection.insertMany(recipes);
    console.log(
      `${insertManyResult.insertedCount} documents successfully inserted.\n`,
    );
    result = `${insertManyResult.insertedCount} documents successfully inserted.`;
  } catch (err) {
    console.error(
      `Something went wrong trying to insert the new documents: ${err}\n`,
    );
    result = `Something went wrong trying to insert the new documents: ${err}`;
  }

  let r = { result: result };
  res.json(r);
});

// ============================================================================
// INICIO DEL SERVIDOR
// ============================================================================

/**
 * Inicia el servidor en el puerto 3000.
 * Al arrancar, se conecta a MongoDB Atlas y prepara las referencias
 * a la base de datos y colección.
 */
app.listen(3000, async function () {
  console.log("Aplicación ejemplo, escuchando el puerto 3000!");
  await connectDB();
  prepareDB();
  console.log(`Base de datos: ${dbName} | Colección: ${collectionName}`);
  console.log("Servidor listo para recibir peticiones.");
});
