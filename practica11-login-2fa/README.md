# Práctica 11 — Login en dos pasos con PIN por correo (`practica11-login-2fa`)

## Objetivo

Reforzar el login de la práctica 10 con un segundo factor de autenticación: después de validar usuario y contraseña, el servidor genera un PIN de 6 dígitos, lo guarda temporalmente (con fecha de expiración) y lo envía por **correo real** usando Nodemailer + Gmail. El usuario debe enviar ese PIN en un segundo endpoint para completar el login.

## Tecnologías

- Node.js (CommonJS)
- Express 5
- Driver oficial `mongodb`
- `nodemailer` (envío de correos vía Gmail)
- Módulo nativo `crypto` (hash SHA-256 y generación del PIN)
- `dotenv`

## Configuración

```bash
cp .env.example .env
```

```
MONGO_URI=mongodb+srv://usuario:password@cluster0.xxxxx.mongodb.net/?appName=Cluster0
GMAIL_USER=tu_correo@gmail.com
GMAIL_APP_PASS=contraseña_de_aplicación_de_gmail
```

`GMAIL_APP_PASS` es una [contraseña de aplicación](https://myaccount.google.com/apppasswords) de Gmail, no la contraseña normal de la cuenta.

## Instalación y ejecución

```bash
npm install
npm start
```

El servidor usa la base `myDatabaseProyectos`, colección `UsuariosLoginDosPasos`.

## Endpoints

| Método | Ruta | Body | Response |
|--------|------|------|----------|
| POST | `/receipt/insert` | `{ id, nombre, email, password }` | `{ insertedId }` — password cifrado con SHA-256 |
| POST | `/receipt/login/step1` | `{ id, password }` | `200 { ok: true, message }` y envía el PIN por correo, o `401` si las credenciales son inválidas |
| POST | `/receipt/login/step2` | `{ id, pin }` | `200 { ok: true }` si el PIN es correcto y no ha expirado; `401` si es incorrecto, ya se usó o expiró |

## Cómo funciona el código

**`generarPin()`** produce un PIN numérico de 6 dígitos con `crypto.randomInt(100000, 1000000)`.

**`POST /receipt/login/step1`** valida usuario y contraseña igual que en la práctica 10. Si son correctos, genera el PIN, calcula `pinExpira` como `Date.now() + 3 minutos`, guarda ambos en el documento del usuario, y usa `transporter.sendMail(...)` para enviarlo al correo registrado del usuario. La respuesta HTTP **nunca incluye el PIN**, solo confirma que se envió.

**`POST /receipt/login/step2`** busca al usuario, y si no hay un PIN pendiente responde `401`. Si `new Date() > pinExpira`, limpia el PIN de la base y responde `401 "PIN expirado"`. Si el PIN no coincide, `401 "PIN incorrecto"`. Si todo es válido, limpia el PIN (`pin: null, pinExpira: null`) para que sea de un solo uso y responde `200`.

**`transporter`** se configura una sola vez al arrancar el servidor con el servicio `gmail` de Nodemailer, usando `GMAIL_USER`/`GMAIL_APP_PASS` desde variables de entorno — nunca hardcodeadas.

## Pruebas realizadas

Servidor levantado con `node index.js`, todo probado con `curl` contra el servidor real, con un usuario de prueba cuyo correo es una cuenta real de Gmail para verificar la recepción efectiva del PIN.

**Insertar usuario y login step1 (correcto e incorrecto)** — el paso correcto dispara el envío real del correo:

![Insert y login step1](./docs/01-insert-login-step1.png)

**Login step2 con el PIN real recibido por correo (éxito) y reintento del mismo PIN (falla por ser de un solo uso)**:

![Step2 correcto y reuso](./docs/02-step2-correcto-reuso.png)

**PIN expirado**: se generó un PIN, se esperaron más de 3 minutos reales (tiempo real transcurrido, no simulado) y al intentar usarlo el servidor lo rechaza correctamente:

![PIN expirado](./docs/03-pin-expirado.png)

**Correo real recibido** en `sajitlove2002@gmail.com` con el PIN de verificación:

![Correo real con el PIN](./docs/04-correo-pin-real.png)
