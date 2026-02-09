var express = require('express');
var app = express(); //Contenedor de Endpoints o WS Restful

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", async function (request, response) {
  var r = {
    'message': 'Nothing to send'
  };

  response.json(r);
});

app.get("/random", async function (request, response) {
  var numero = Math.floor(Math.random() * 100) + 1;
  response.json({ numero: numero });
});

app.listen(3000, function() {
    console.log('Aplicación ejemplo, escuchando el puerto 3000!');
});