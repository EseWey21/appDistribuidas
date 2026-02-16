# Servicios REST de Cadenas (Node.js + Express)
Práctica de Aplicaciones Distribuidas

## Descripción
API REST desarrollada con Node.js y Express para realizar operaciones sobre cadenas.

Todos los servicios:
- Reciben parámetros en formato JSON
- Responden en formato JSON
- Validan parámetros de entrada (campos requeridos, string no vacío)
- Responden con un atributo `ok` indicando éxito o error

## Tecnologías
- Node.js
- Express
- `crypto` (módulo nativo de Node.js) para SHA256
- Nodemon (desarrollo)

## Estructura
```text
src/
  controllers/
    strings.controller.js
  routes/
    strings.routes.js
  utils/
    response.js
    validate.js
  index.js
```

## Instalación y ejecución
Instalación:
```bash
npm install
```

Desarrollo (recarga automática):
```bash
npm run dev
```

Producción:
```bash
npm start
```

Servidor:
- `http://localhost:3000`

Prefijo de API:
- `http://localhost:3000/api`

Endpoints de verificación:
- `GET /health`
- `GET /api/ping`

## Formato de respuestas
Éxito:
```json
{ "ok": true, "resultado": "..." }
```

Error:
```json
{ "ok": false, "error": "Descripción del error" }
```

## Endpoints

### 1) POST `/api/mascaracteres`
Regresa la cadena con más caracteres (si hay empate, regresa `cadena1`).

Entrada:
```json
{ "cadena1": "hola", "cadena2": "mundo" }
```

Salida:
```json
{ "ok": true, "resultado": "mundo" }
```

### 2) POST `/api/menoscaracteres`
Regresa la cadena con menos caracteres (si hay empate, regresa `cadena1`).

Entrada:
```json
{ "cadena1": "hola", "cadena2": "adios" }
```

Salida:
```json
{ "ok": true, "resultado": "hola" }
```

### 3) POST `/api/numcaracteres`
Regresa el número de caracteres de una cadena.

Entrada:
```json
{ "cadena": "hola" }
```

Salida:
```json
{ "ok": true, "resultado": 4 }
```

### 4) POST `/api/palindroma`
Regresa `true` si la cadena es palíndroma, `false` en otro caso.

Normalización aplicada:
- Convierte a minúsculas
- Elimina acentos
- Elimina espacios y signos de puntuación (deja solo letras y números)

Entrada:
```json
{ "cadena": "¿Anita lava la tina?" }
```

Salida:
```json
{ "ok": true, "resultado": true }
```

### 5) POST `/api/concat`
Concatena dos cadenas iniciando con `cadena1`.

Entrada:
```json
{ "cadena1": "hola", "cadena2": "mundo" }
```

Salida:
```json
{ "ok": true, "resultado": "holamundo" }
```

### 6) POST `/api/applysha256`
Aplica SHA256 a una cadena y regresa la original y la encriptada.

Entrada:
```json
{ "cadena": "hola" }
```

Salida:
```json
{
  "ok": true,
  "original": "hola",
  "encriptada": "2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824"
}
```

### 7) POST `/api/verifysha256`
Recibe una cadena encriptada (SHA256) y una cadena normal; calcula SHA256 de la normal y compara.

Campos:
- `encriptada` (requerida): SHA256 hexadecimal de 64 caracteres
- `normal` (requerida)

Compatibilidad:
- También se acepta `cadena` como alias de `normal`.

Entrada:
```json
{
  "encriptada": "2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824",
  "normal": "hola"
}
```

Salida:
```json
{ "ok": true, "resultado": true }
```

## Validaciones implementadas
- Campos requeridos presentes
- Tipo string no vacío (`requireString`)
- En `verifysha256`, `encriptada` debe tener formato SHA256 hex (64 caracteres)


