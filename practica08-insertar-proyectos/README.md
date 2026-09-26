# Práctica 8 — Insertar proyectos desde el body (`practica08-insertar-proyectos`)

## Objetivo

Insertar documentos en MongoDB de forma **dinámica**, con los datos que llegan en el request (a diferencia de la práctica 7, donde el documento insertado era fijo). También se conservan las tres rutas de ejemplo que muestran las tres formas de mandar datos a un servicio: query string, body JSON y parámetro de ruta.

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

El servidor se conecta a MongoDB **antes** de empezar a escuchar peticiones, y usa la base `myDatabaseProyectos`, colección `proyectos`.

## Endpoints

| Método | Ruta | Datos | Response |
|--------|------|-------|----------|
| GET | `/serv001?id=&token=&geo=` | query string | `{ user_id, token, geo }` |
| POST | `/serv002` | body JSON `{ id, token, geo }` | `{ user_id, token, geo }` |
| POST | `/serv003/:info` | parámetro de ruta | `{ info }` |
| POST | `/receipt/insert` | body JSON `{ nombre, descripcion, autores[], asesores[], presupuesto }` | `{ insertedId }` o `400 { error }` |

## Cómo funciona el código

**`/serv001`, `/serv002`, `/serv003/:info`** son la misma idea expresada de tres formas: leer datos de `req.query` (query string en la URL), `req.body` (JSON en el cuerpo de la petición) y `req.params` (parte de la URL definida como `:info` en la ruta).

**`/receipt/insert`** valida que `nombre` y `descripcion` sean texto, `autores` y `asesores` sean arreglos, y `presupuesto` sea un número; si algo no cumple, responde `400` con el detalle. Si todo es válido, llama a `proyectosCollection.insertOne(...)` con el documento armado desde el body, y responde con el `insertedId` que MongoDB generó automáticamente para ese documento.

**Conexión antes de escuchar:** la función `start()` hace `await client.connect()` y guarda la referencia a la colección (`proyectosCollection`) **antes** de llamar a `app.listen(...)`. Así se evita que el servidor reciba peticiones cuando la conexión a la base todavía no está lista.

## Pruebas realizadas

Servidor levantado con `node index.js`, todas las rutas probadas con `curl` contra el servidor real (que sí escribió en Atlas).

**`/serv001`, `/serv002`, `/serv003/:info`:**

![serv001/002/003](./docs/01-serv001-002-003.png)

**Inserción de 3 proyectos reales y un caso con campos faltantes (400):**

![insertar proyectos](./docs/02-insertar-proyectos.png)

**Colección `proyectos` en Atlas Data Explorer**, con los 6 proyectos insertados durante las pruebas:

![Atlas Data Explorer - proyectos](./docs/03-atlas-proyectos.png)
