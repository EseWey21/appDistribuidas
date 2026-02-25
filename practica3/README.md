# Práctica 3 — Conexión a MongoDB (Mongoose)

Proyecto Node.js que carga variables de entorno desde `.env`, se conecta a MongoDB con **Mongoose** y lista las bases de datos disponibles usando el driver nativo a través de `mongoose.connection.db`.

## Requisitos

- Node.js instalado
- Una URI válida de MongoDB en `MONGODB_URI`

## Instalación

```bash
npm install
```

## Configuración

1. Crea tu archivo `.env` (no se sube a GitHub):

```bash
cp .env.example .env
```

2. Edita `.env` y coloca tu conexión:

```env
MONGODB_URI=mongodb+srv://USER:PASSWORD@HOST/DB?retryWrites=true&w=majority
```

## Uso

- Modo desarrollo (reinicio automático con nodemon):

```bash
npm run dev
```

- Modo normal:

```bash
npm start
```

## Qué hace

- Conecta a MongoDB con `mongoose.connect(MONGODB_URI)`
- Imprime `✅ Conexión exitosa a MongoDB`
- Lista las bases de datos disponibles (equivalente a un `listDatabases`)
- Cierra la conexión limpiamente con `Ctrl+C` (manejo de `SIGINT`)

## Captura

> Guarda la imagen de la ejecución en `docs/conexion-mongodb.png` para que se renderice aquí en GitHub.

![Conexión y listado de bases de datos](docs/conexion-mongodb.png)

## Notas de seguridad

- No subas tu `.env` ni credenciales al repositorio.
- Si tu URI/contraseña ya se compartió o se subió por error, rota la contraseña/usuario en MongoDB Atlas y reemplaza la URI.
