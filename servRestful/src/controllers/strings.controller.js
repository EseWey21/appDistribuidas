const { ok, fail } = require("../utils/response");
const { requireString } = require("../utils/validate");
const crypto = require("crypto");

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

// menoscaracteres: recibe dos cadenas y regresa la que tenga menos caracteres.
// Si son iguales, regresa la del primer parámetro.
function menosCaracteres(req, res) {
  const v1 = requireString(req.body, "cadena1");
  if (!v1.ok) return fail(res, v1.error);

  const v2 = requireString(req.body, "cadena2");
  if (!v2.ok) return fail(res, v2.error);

  const cadena1 = v1.value;
  const cadena2 = v2.value;

  const resultado = cadena1.length <= cadena2.length ? cadena1 : cadena2;
  return ok(res, { resultado });
}

// numcaracteres: recibe una cadena y regresa el número de caracteres
function numCaracteres(req, res) {
  const v = requireString(req.body, "cadena");
  if (!v.ok) return fail(res, v.error);

  const cadena = v.value;
  const resultado = cadena.length;

  return ok(res, { resultado });
}

// palindroma: recibe una cadena y regresa true si es palíndroma, false en otro caso.
function palindroma(req, res) {
  const v = requireString(req.body, "cadena");
  if (!v.ok) return fail(res, v.error);

  const original = v.value;
  const normalizada = original
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[^\p{L}\p{N}]+/gu, "");
  const invertida = normalizada.split("").reverse().join("");

  const resultado = normalizada === invertida;
  return ok(res, { resultado });
}

// concat: recibe dos cadenas y regresa la concatenación iniciando con el primer parámetro.
function concat(req, res) {
  const v1 = requireString(req.body, "cadena1");
  if (!v1.ok) return fail(res, v1.error);

  const v2 = requireString(req.body, "cadena2");
  if (!v2.ok) return fail(res, v2.error);

  const resultado = `${v1.value}${v2.value}`;
  return ok(res, { resultado });
}

// applysha256: recibe una cadena, aplica SHA256 y regresa original y encriptada.
function applysha256(req, res) {
  const v = requireString(req.body, "cadena");
  if (!v.ok) return fail(res, v.error);

  const original = v.value;
  const encriptada = crypto.createHash("sha256").update(original, "utf8").digest("hex");

  return ok(res, { original, encriptada });
}

// verifysha256: recibe una cadena encriptada y una cadena normal; aplica SHA256 a la normal y compara.
function verifysha256(req, res) {
  const vEnc = requireString(req.body, "encriptada");
  if (!vEnc.ok) return fail(res, vEnc.error);

  // Enunciado: "cadena normal". Aceptamos `normal` y mantenemos `cadena` como alias.
  const vNorm = ("normal" in req.body)
    ? requireString(req.body, "normal")
    : requireString(req.body, "cadena");
  if (!vNorm.ok) return fail(res, "Falta el campo 'normal'");

  const sha256Hex = /^[a-f0-9]{64}$/i;
  if (!sha256Hex.test(vEnc.value)) {
    return fail(res, "El campo 'encriptada' debe ser un SHA256 hexadecimal de 64 caracteres");
  }

  const calculada = crypto.createHash("sha256").update(vNorm.value, "utf8").digest("hex");
  if (!sha256Hex.test(calculada)) {
    return fail(res, "Error al calcular SHA256", null, 500);
  }
  const resultado = calculada === vEnc.value;

  return ok(res, { resultado });
}

module.exports = {
  ping,
  masCaracteres,
  menosCaracteres,
  numCaracteres,
  palindroma,
  concat,
  applysha256,
  verifysha256,
};
