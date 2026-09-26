# Práctica 7 — Express + MongoDB (`practica07-express-mongodb`)

## Objetivo

Juntar Express y MongoDB en un mismo servidor, y mostrar las **tres formas de enviar datos** a un servicio REST: por query string, por body JSON, y por parámetro de ruta.

## Tecnologías

- Node.js (CommonJS)
- Express 5
- Driver oficial `mongodb`
- `dotenv`

## Configuración

```bash
cp .env.example .env
```

```
MONGO_URI=mongodb+srv://usuario:password@cluster0.xxxxx.mongodb.net/?appName=Cluster0
```

## Instalación y ejecución

```bash
npm install
npm start
```

El servidor se conecta a MongoDB **antes** de empezar a escuchar peticiones, y usa la base `myDatabase`, colección `recipes`.

## Endpoints

| Método | Ruta | Datos | Response |
|--------|------|-------|----------|
| GET | `/serv001?id=&token=&geo=` | query string | `{ user_id, token, geo }` |
| POST | `/serv002` | body JSON `{ id, token, geo }` | `{ user_id, token, geo }` |
| POST | `/serv003/:info` | parámetro de ruta | `{ info }` |
| POST | `/receipt/insert` | — | `{ insertedCount }` |

## Cómo funciona el código

**`/serv001`** lee de `req.query` (lo que va después del `?` en la URL). **`/serv002`** lee de `req.body` (el JSON enviado en el cuerpo de la petición). **`/serv003/:info`** lee de `req.params` (la parte de la URL definida como `:info` en la ruta). Las tres son la misma idea — recibir un dato — expresada de tres formas distintas que existen en cualquier API REST.

**`/receipt/insert`** inserta un documento fijo de ejemplo (una receta de tacos al pastor) usando `insertMany`, que a diferencia de `insertOne` recibe un arreglo de documentos (aquí con un solo elemento) y puede insertar varios de una sola vez. Responde con `insertedCount`, la cantidad de documentos que MongoDB confirmó haber insertado.

**Conexión antes de escuchar:** igual que en la práctica 8, la función `start()` hace `await client.connect()` y guarda la referencia a la colección antes de llamar `app.listen(...)`, para no aceptar peticiones antes de que la conexión a la base esté lista.

## Pruebas realizadas

Servidor levantado con `node index.js`, todas las rutas probadas con `curl` contra el servidor real (con inserción real en Atlas).

**`/serv001`, `/serv002`, `/serv003/:info`:**

![serv001/002/003](./docs/01-serv001-002-003.png)

**`/receipt/insert`:**

![insertar receta](./docs/02-insert-receta.png)
