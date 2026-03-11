# Práctica 7 – Aplicaciones Distribuidas

## Descripción

Servidor RESTful desarrollado con **Express.js** y **MongoDB Atlas**. Demuestra diferentes formas de enviar y recibir datos a través de servicios web, así como la inserción de documentos en una base de datos NoSQL en la nube.

## Requisitos previos

- Node.js v14+
- npm
- Conexión a internet (MongoDB Atlas)

## Instalación y ejecución

```bash
# 1. Instalar dependencias
npm install

# 2. Iniciar el servidor
npm run dev
```

El servidor queda disponible en **http://localhost:3000**.

## Tecnologías utilizadas

| Tecnología | Versión | Uso |
|---|---|---|
| Express | ^5.2.1 | Framework web para crear los endpoints REST |
| MongoDB Driver | ^7.1.0 | Conexión y operaciones con MongoDB Atlas |
| Node.js | 14+ | Entorno de ejecución |

## Estructura del proyecto

```
practica7/
├── insertMongoDB.js   # Servidor principal con todos los endpoints
├── package.json       # Configuración del proyecto y dependencias
├── README.md          # Documentación
└── node_modules/      # Dependencias instaladas (generado por npm)
```

## Configuración de MongoDB

El servidor se conecta automáticamente al clúster de MongoDB Atlas al iniciar. Utiliza la base de datos `myDatabase` y la colección `recipes`.

## Endpoints

### `GET /` — Health check

Verifica que el servidor esté activo.

```
GET http://localhost:3000/
```

Respuesta:
```json
{ "message": "Nothing to send" }
```

---

### `GET /serv001` — Datos por query params

Recibe `id`, `token` y `geo` como parámetros en la URL.

```
GET http://localhost:3000/serv001?id=Nope&token=2345678dhuj43567fgh&geo=123456789,1234567890
```

Respuesta:
```json
{
  "user_id": "Nope",
  "token": "2345678dhuj43567fgh",
  "geo": "123456789,1234567890"
}
```

---

### `GET /serv0010` — Variante de serv001

Mismo comportamiento que `/serv001`. Endpoint duplicado con fines demostrativos.

---

### `POST /serv002` — Datos por body (JSON)

Recibe `id`, `token` y `geo` en el cuerpo de la petición.

```
POST http://localhost:3000/serv002
Content-Type: application/json

{
  "id": "nope",
  "token": "ertydfg456Dfgwerty",
  "geo": "12345678,34567890"
}
```

Respuesta:
```json
{
  "user_id": "nope",
  "token": "ertydfg456Dfgwerty",
  "geo": "12345678,34567890"
}
```

---

### `POST /serv003/:info` — Parámetro en la URL

Recibe un dato directamente como parte de la ruta.

```
POST http://localhost:3000/serv003/1234567
```

Respuesta:
```json
{ "info": "1234567" }
```

---

### `POST /receipt/insert` — Insertar recetas en MongoDB

Inserta una o más recetas en la colección `recipes` de MongoDB Atlas.

#### Modificación realizada respecto al código original

| Aspecto | Antes | Después |
|---|---|---|
| Origen de datos | Hard-coded en el servidor (siempre "elotes cocidos") | Se reciben dinámicamente desde el body de la petición |
| Flexibilidad | Solo insertaba una receta fija | Permite insertar cualquier cantidad de recetas |
| Validación | Ninguna | Valida que `recipes` sea un arreglo no vacío |

#### Ejemplo de uso

```
POST http://localhost:3000/receipt/insert
Content-Type: application/json

{
  "recipes": [
    {
      "name": "elotes cocidos",
      "ingredients": ["corn", "mayonnaise", "cotija cheese", "sour cream", "lime"],
      "prepTimeInMinutes": 35
    },
    {
      "name": "guacamole",
      "ingredients": ["avocado", "tomato", "onion", "cilantro", "lime", "salt"],
      "prepTimeInMinutes": 15
    }
  ]
}
```

Respuesta exitosa:
```json
{ "result": "2 documents successfully inserted." }
```

Respuesta de error (body vacío o inválido) — HTTP 400:
```json
{ "result": "Error: Se debe enviar un arreglo 'recipes' en el body de la petición con al menos un elemento." }
```

#### Esquema de cada receta

| Campo | Tipo | Descripción |
|---|---|---|
| `name` | string | Nombre de la receta |
| `ingredients` | string[] | Lista de ingredientes |
| `prepTimeInMinutes` | number | Tiempo de preparación en minutos |

## Verificación en MongoDB Atlas

1. Ingresar a [MongoDB Atlas](https://cloud.mongodb.com/)
2. Ir a **Database** → **Browse Collections**
3. Seleccionar la base de datos `myDatabase`
4. Abrir la colección `recipes`
5. Los documentos insertados aparecerán con los campos `name`, `ingredients` y `prepTimeInMinutes`
