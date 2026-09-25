# Práctica 6 — Consultas con proyección (`practica06-consultas-mongodb`)

## Objetivo

Leer datos reales de la base de ejemplo `sample_mflix` en MongoDB Atlas usando **proyección**: en vez de traer el documento completo, se le pide al driver solo los campos necesarios.

## Tecnologías

- Node.js (CommonJS)
- Driver oficial `mongodb`
- `dotenv`

## Configuración

```bash
cp .env.example .env
```

```
MONGO_URI=mongodb+srv://usuario:password@cluster0.xxxxx.mongodb.net/?appName=Cluster0
```

Requiere que el clúster de Atlas tenga cargada la base de ejemplo `sample_mflix` (Atlas → Load Sample Dataset).

## Instalación y ejecución

```bash
npm install
npm start
```

## Cómo funciona el código

El script:

1. Lista las bases de datos disponibles con `client.db().admin().listDatabases()`.
2. Consulta 5 documentos de la colección `comments` con proyección:
   ```js
   db.collection("comments")
     .find({}, { projection: { _id: 1, name: 1, email: 1, movie_id: 1, text: 1 } })
     .limit(5)
   ```
3. Consulta 5 documentos de `embedded_movies` con proyección sobre otros campos (`title`, `year`, `runtime`, `comments`).

El segundo argumento de `.find()` es el objeto de **opciones**, donde `projection` indica con `1` qué campos incluir en el resultado (todos los demás se excluyen automáticamente, salvo `_id` que se incluye por defecto a menos que se ponga en `0`). Esto reduce el tamaño de la respuesta cuando no se necesita el documento completo — por ejemplo, `embedded_movies` tiene documentos con muchos campos (elenco, sinopsis, calificaciones, etc.) y aquí solo interesan 4.

Cada documento se imprime con `JSON.stringify(doc, null, 4)`, que lo formatea con 4 espacios de indentación para que sea legible en la terminal.

## Pruebas realizadas

Script ejecutado con `node consultas.js` contra el clúster real de Atlas.

**Listado de bases de datos y 5 documentos de `comments`:**

![bases de datos y comments](./docs/01-bases-y-comments.png)

**5 documentos de `embedded_movies`:**

![embedded_movies](./docs/02-embedded-movies.png)
