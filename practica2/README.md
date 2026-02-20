# Practica 2 - API REST (Node.js + Express)

Este proyecto implementa una API RESTful para la Practica 2 de Aplicaciones Distribuidas. Incluye los 7 servicios solicitados, manejo de errores para evitar excepciones en el servidor, y respuestas con el campo `estado` en todos los endpoints.

## Requisitos
- Node.js 18 o superior
- npm

## Instalacion
1. Clonar el repositorio
2. Instalar dependencias:

```bash
npm install
```

## Ejecucion

Modo desarrollo (reinicio automatico con nodemon):

```bash
npm run dev
```

Modo produccion:

```bash
npm start
```

Por defecto, el servidor corre en:

- http://localhost:3000

## Estructura del proyecto

- `src/index.js`: servidor Express y definicion de endpoints
- `docs/`: evidencias (capturas) de pruebas realizadas en Postman

## Formato de respuestas

Todas las respuestas incluyen un campo `estado`:

- Exito: `estado: true`
- Error: `estado: false` y un campo `error` con descripcion

Ejemplo de exito:

```json
{
  "estado": true,
  "mensaje": "Hola, Eduardo"
}
```

Ejemplo de error:

```json
{
  "estado": false,
  "error": "El campo 'nombre' debe ser un string no vacio"
}
```

## Endpoints

### 1) Saludo

- Metodo: POST
- Ruta: `/saludo`
- Body:

```json
{ "nombre": "Eduardo" }
```

- Respuesta:

```json
{ "estado": true, "mensaje": "Hola, Eduardo" }
```

### 2) Calculadora

- Metodo: POST
- Ruta: `/calcular`
- Body:

```json
{ "a": 10, "b": 5, "operacion": "suma" }
```

- Operaciones validas: `suma`, `resta`, `multiplicacion`, `division`
- Nota: division entre cero devuelve error.

### 3) CRUD de tareas (en memoria)

- Arreglo en memoria sin base de datos
- Modelo:

```json
{ "id": 1, "titulo": "Hacer la practica", "completada": false }
```

- Crear tarea
  - Metodo: POST
  - Ruta: `/tareas`

- Listar tareas
  - Metodo: GET
  - Ruta: `/tareas`

- Actualizar tarea
  - Metodo: PUT
  - Ruta: `/tareas/:id`
  - Body (ejemplo):

```json
{ "completada": true }
```

- Eliminar tarea
  - Metodo: DELETE
  - Ruta: `/tareas/:id`

### 4) Validador de contrasenas

- Metodo: POST
- Ruta: `/validar-password`
- Body:

```json
{ "password": "Abcd1234" }
```

- Reglas:
  - minimo 8 caracteres
  - al menos 1 mayuscula
  - al menos 1 minuscula
  - al menos 1 numero

- Respuesta:

```json
{
  "estado": true,
  "esValida": false,
  "errores": ["Debe tener minimo 8 caracteres"]
}
```

### 5) Convertir temperatura

- Metodo: POST
- Ruta: `/convertir-temperatura`
- Body:

```json
{ "valor": 25, "desde": "C", "hacia": "F" }
```

- Escalas validas: `C`, `F`, `K`
- Respuesta incluye `valorOriginal`, `valorConvertido`, `escalaOriginal`, `escalaConvertida`.

### 6) Buscar elemento en arreglo

- Metodo: POST
- Ruta: `/buscar`
- Body:

```json
{ "array": [10, 20, 30], "elemento": 20 }
```

- Respuesta:

```json
{
  "estado": true,
  "encontrado": true,
  "indice": 1,
  "tipoElemento": "number"
}
```

### 7) Contar palabras

- Metodo: POST
- Ruta: `/contar-palabras`
- Body:

```json
{ "texto": "Hola mundo hola" }
```

- Respuesta:

```json
{
  "estado": true,
  "totalPalabras": 3,
  "totalCaracteres": 15,
  "palabrasUnicas": 2
}
```

## Pruebas en Postman

Se recomienda crear una Collection en Postman con variable `baseUrl = http://localhost:3000` y realizar pruebas de:

- Casos correctos (OK) para los 7 endpoints
- Casos de error relevantes (por ejemplo: division entre cero, password invalida, tarea duplicada, escalas invalidas)

Las evidencias (capturas) deben guardarse en la carpeta `docs/`.

## Evidencias

Las capturas de pruebas se encuentran en `docs/` con un nombre descriptivo por endpoint.
