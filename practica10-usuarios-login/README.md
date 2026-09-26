# Práctica 10 — Usuarios con contraseña cifrada y login (`practica10-usuarios-login`)

## Objetivo

Construir un CRUD de usuarios donde la contraseña **nunca se guarda en texto plano**: se cifra con SHA-256 antes de insertarse en la base, y se agrega un endpoint de login que verifica las credenciales comparando el hash, no la contraseña original.

## Tecnologías

- Node.js (CommonJS)
- Express 5
- Driver oficial `mongodb`
- Módulo nativo `crypto` (hash SHA-256)
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

El servidor usa la base `myDatabaseProyectos`, colección `Usuarios`.

## Endpoints

| Método | Ruta | Body | Response |
|--------|------|------|----------|
| POST | `/receipt/insert` | `{ id, nombre, email, password }` | `{ insertedId }` — la contraseña se guarda como hash SHA-256 |
| GET | `/receipt/get` | — | `{ usuarios: [...] }` — **nunca incluye el campo password** |
| PUT | `/receipt/update/:id` | campos a modificar | `{ matchedCount, modifiedCount }` o `404 { error: "no encontrado" }` — si viene `password`, se vuelve a hashear |
| DELETE | `/receipt/delete/:id` | — | `{ deletedCount }` o `404 { error: "no encontrado" }` |
| POST | `/receipt/login` | `{ id, password }` | `200 { ok: true }` si coincide, `401 { ok: false, error }` si no |

## Cómo funciona el código

**`hashPassword(password)`** centraliza el cifrado: `crypto.createHash("sha256").update(password).digest("hex")`. Se usa tanto al insertar como al actualizar y al hacer login, así el mismo texto siempre produce el mismo hash.

**`POST /receipt/insert`** valida los cuatro campos como string y guarda el documento con `password` ya cifrado — el texto plano que llegó en el body nunca toca la base de datos.

**`GET /receipt/get`** usa `find({}, { projection: { password: 0 } })` para excluir explícitamente el campo password de la respuesta, incluso siendo un hash: no hay ninguna razón para exponerlo en una lista de usuarios.

**`PUT /receipt/update/:id`** copia el body y, solo si trae `password`, la vuelve a hashear antes del `$set`; así se puede actualizar nombre/email sin tocar la contraseña, o cambiar la contraseña sin que quede en texto plano.

**`POST /receipt/login`** busca el usuario por `id`, hashea el password recibido en el body y lo compara contra el hash guardado (`usuario.password !== hashPassword(password)`). Responde `401` tanto si el usuario no existe como si la contraseña no coincide, para no revelar cuál de las dos cosas falló.

## Pruebas realizadas

Servidor levantado con `node index.js`, todo probado con `curl` contra el servidor real.

**Insertar usuario, listar sin exponer password, login correcto y login incorrecto**:

![Insert, GET y login](./docs/01-insert-get-login.png)

**Actualizar contraseña (se re-cifra), login con contraseña vieja (falla) y con la nueva (pasa), y casos 404**:

![Update, login y errores 404](./docs/02-update-login-errores404.png)

**Colección `Usuarios` en Atlas Data Explorer**, mostrando que el campo `password` se guarda como hash SHA-256 y nunca como texto plano:

![Atlas Data Explorer - password cifrado](./docs/03-atlas-password-cifrado.png)
