const { ok, fail } = require("../utils/response");
const { requireString } = require("../utils/validate");

function ping(req, res) {
  return ok(res, { message: "strings service ok" });
}

// mascaracteres: recibe dos cadenas y regresa la que tenga más caracteres.
// Si son iguales, regresa la del primer parámetro.
function masCaracteres(req, res) {
  const v1 = requireString(req.body, "cadena1");
  if (!v1.ok) return fail(res, v1.error);

  const v2 = requireString(req.body, "cadena2");
  if (!v2.ok) return fail(res, v2.error);

  const cadena1 = v1.value;
  const cadena2 = v2.value;

  const resultado = cadena1.length >= cadena2.length ? cadena1 : cadena2;
  return ok(res, { resultado });
}

module.exports = { ping, masCaracteres };
