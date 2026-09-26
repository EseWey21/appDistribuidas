# Práctica 9 — CRUD con borrado lógico (`practica09-crud-proyectos`)

## Objetivo

Armar el CRUD completo de proyectos y distinguir entre **borrado físico** (el documento desaparece para siempre) y **borrado lógico** (el documento sigue en la base, solo se marca `deleted: true` y deja de aparecer en las consultas normales).

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

El servidor usa la base `myDatabaseProyectos`, colección `proyectos` (la misma de la práctica 8).

## Endpoints

| Método | Ruta | Body | Response |
|--------|------|------|----------|
| POST | `/receipt/insert` | `{ id, nombre, descripcion, autores[], asesores[], presupuesto }` | `{ insertedId }` — agrega `deleted: false` automáticamente |
| GET | `/receipt/get` | — | `{ proyectos: [...] }` — solo los que tienen `deleted: false` |
| PUT | `/receipt/update/:id` | campos a modificar | `{ matchedCount, modifiedCount }` o `404 { error: "no encontrado" }` |
| DELETE | `/receipt/delete/:id` | — | `{ deletedCount }` — **borrado físico** |
| PUT | `/receipt/delete/:id` | — | `{ matchedCount, modifiedCount }` — **borrado lógico** (`deleted: true`) |

## Cómo funciona el código

**`POST /receipt/insert`** es igual que en la práctica 8 pero además exige un `id` de texto (el identificador de negocio que usan las demás rutas, distinto del `_id` interno de MongoDB) y agrega `deleted: false` al documento.

**`GET /receipt/get`** filtra con `find({ deleted: false })`, así que un proyecto marcado como borrado lógicamente deja de aparecer aquí sin haber sido eliminado de la base.

**`PUT /receipt/update/:id`** hace `updateOne({ id }, { $set: req.body })`. Si `matchedCount` es 0 (no existe ningún documento con ese `id`), responde `404` con `"no encontrado"`.

**`DELETE /receipt/delete/:id`** hace `deleteOne({ id })` — el documento se borra físicamente de MongoDB, no hay forma de recuperarlo.

**`PUT /receipt/delete/:id`** (mismo path que el anterior, pero método `PUT` en vez de `DELETE`) hace `updateOne({ id }, { $set: { deleted: true } })` — el documento sigue existiendo en la base, solo cambia ese campo.

## Un bug real que apareció al probar (y cómo se resolvió)

Al repetir las pruebas dos veces seguidas con los mismos valores de `id` ("p9-A", "p9-B"), la colección terminó con **documentos duplicados** con el mismo `id` (uno de la primera corrida, ya con `deleted: true`, y otro nuevo con `deleted: false`). Como `updateOne` solo modifica **un** documento que haga match — no necesariamente el que uno espera — el borrado lógico reportó `matchedCount: 1, modifiedCount: 0` porque encontró primero el documento viejo que ya tenía `deleted: true`, y el nuevo se quedó sin tocar. La solución fue limpiar los documentos duplicados antes de repetir la prueba. Esto no es un bug del código: en una aplicación real, `id` debería tener un índice único en MongoDB para que esta situación ni siquiera pudiera ocurrir.

## Pruebas realizadas

Servidor levantado con `node index.js`, todo probado con `curl` contra el servidor real.

**Ciclo CRUD completo**: insertar dos proyectos, actualizar uno, borrar el otro lógicamente, confirmar con `GET` que ya no aparece (mientras el otro sí, con el cambio aplicado), y finalmente borrar el primero físicamente y confirmar que `GET` queda vacío:

![Ciclo CRUD completo](./docs/01-ciclo-crud-completo.png)

**Casos de error 404** — actualizar y borrar un `id` que no existe:

![Errores 404](./docs/02-errores-404.png)

**Colección `proyectos` en Atlas Data Explorer**, mostrando que el proyecto borrado lógicamente (`p9-B`) sigue existiendo en la base con `deleted: true`, aunque ya no aparecía en `GET /receipt/get`:

![Atlas Data Explorer - borrado lógico](./docs/03-atlas-borrado-logico.png)
