# Practica 7 - Insercion en MongoDB con Express

## 1) Descargar el codigo
Si ya tienes el repositorio, entra a la carpeta de la practica:

```bash
cd /Users/esewey21/Desktop/appDistribuidas/practica7
```

Si no tienes dependencias instaladas:

```bash
npm install express mongodb
```

## 2) Ajustar la URI de MongoDB
En `insertMongoDB.js`, dentro de la funcion `connectDB()`, define tu URI de MongoDB Atlas.

## 3) Probar el codigo
Ejecuta el servidor:

```bash
npm run dev
```

Servidor esperado:

- Puerto: `3000`
- Mensaje en consola: `Conectado correctamente a MongoDB Atlas`

## 4) Validar la operacion en el server de MongoDB
La aplicacion usa:

- Base de datos: `practica7`
- Coleccion: `recipes`

Puedes validar con MongoDB Compass o con Mongo Shell.

Consulta de validacion:

```javascript
use practica7
db.recipes.find().pretty()
```

## 5) Documentacion del codigo
Endpoints disponibles:

- `GET /`
- `POST /insertar`
- `GET /registros`
- `POST /receipt/insert`

## 6) Modificacion solicitada en `/receipt/insert`
Se modifico el endpoint para que reciba `recipes` como parametro en el body JSON.

### Formato esperado

```json
{
  "recipes": [
    {
      "name": "elotes cocidos",
      "ingredients": ["corn", "mayonnaise", "cotija cheese", "sour cream", "lime"],
      "prepTimeInMinutes": 35
    },
    {
      "name": "quesadilla",
      "ingredients": ["tortilla", "cheese"],
      "prepTimeInMinutes": 10
    }
  ]
}
```

### Prueba con curl

```bash
curl -X POST http://localhost:3000/receipt/insert \
  -H "Content-Type: application/json" \
  -d '{
    "recipes": [
      {
        "name": "elotes cocidos",
        "ingredients": ["corn", "mayonnaise", "cotija cheese", "sour cream", "lime"],
        "prepTimeInMinutes": 35
      }
    ]
  }'
```

Respuesta esperada (ejemplo):

```json
{
  "result": "1 documents successfully inserted.",
  "insertedCount": 1,
  "insertedIds": {
    "0": "<ObjectId>"
  }
}
```

Si `recipes` no se envia o va vacio, responde `400 Bad Request`.

## 7) Agregar esta parte a la documentacion
Esta version del README ya incluye:

- Uso del nuevo formato de `recipes` en `/receipt/insert`
- Ejemplo de request
- Ejemplo de respuesta
- Forma de validacion en MongoDB
