# Práctica 5 — Conexión a MongoDB Atlas (`practica05-conexion-mongodb`)

## Objetivo

Conectarse a un clúster de MongoDB Atlas usando el driver oficial `mongodb` (sin un framework como Mongoose), con dos scripts sueltos: uno de prueba de conexión (`ping`) y otro que lista las bases de datos disponibles.

## Tecnologías

- Node.js (CommonJS)
- Driver oficial `mongodb`
- `dotenv` para leer credenciales desde variables de entorno

## Configuración

Este proyecto necesita credenciales de MongoDB Atlas. Copia `.env.example` a `.env` y llena el valor:

```bash
cp .env.example .env
```

```
MONGO_URI=mongodb+srv://usuario:password@cluster0.xxxxx.mongodb.net/?appName=Cluster0
```

El archivo `.env` **no** se sube al repositorio (está en `.gitignore`).

## Instalación y ejecución

```bash
npm install
npm run ping           # node ping.js
npm run listar-bases   # node listar-bases.js
```

## Cómo funciona el código

Ambos scripts siguen el mismo patrón:

```js
const client = new MongoClient(uri, {
  serverApi: { version: ServerApiVersion.v1, strict: true, deprecationErrors: true },
});

try {
  await client.connect();
  // ... operación ...
} catch (error) {
  console.error(error.message);
} finally {
  await client.close();
}
```

- `serverApi` con `version: ServerApiVersion.v1` le dice al driver que use una versión estable y fija de la API del servidor (evita romperse si Atlas actualiza su versión por defecto).
- El `try/catch/finally` garantiza que `client.close()` se ejecute **siempre**, haya éxito o error — dejar conexiones abiertas agota los recursos disponibles del clúster.
- La URI de conexión nunca está escrita en el código: se lee de `process.env.MONGO_URI`, cargada por `dotenv` desde el archivo `.env` local.

**`ping.js`** manda el comando `{ ping: 1 }` a la base `admin`, el equivalente a un "¿sigues ahí?" — si responde sin error, la conexión y las credenciales son correctas.

**`listar-bases.js`** usa `client.db().admin().listDatabases()` para traer el listado de todas las bases de datos visibles en el clúster con esas credenciales, y las imprime una por una.

**Nota sobre DNS:** si en tu red la URI `mongodb+srv://` falla con `querySrv ECONNREFUSED`, se puede forzar el uso de DNS públicos agregando al inicio del script: `require("node:dns/promises").setServers(["1.1.1.1", "8.8.8.8"]);`. En esta ejecución no fue necesario.

## Pruebas realizadas

Ambos scripts se ejecutaron contra el clúster real de Atlas.

**`node ping.js`:**

![ping.js](./docs/01-ping.png)

**`node listar-bases.js`** (el clúster ya tenía cargada `sample_mflix`, necesaria para la Práctica 6):

![listar-bases.js](./docs/02-listar-bases.png)
