function isNonEmptyString(v) {
  return typeof v === "string" && v.trim().length > 0;
}

function requireString(body, field) {
  if (!(field in body)) return { ok: false, error: `Falta el campo '${field}'` };
  if (!isNonEmptyString(body[field])) return { ok: false, error: `El campo '${field}' debe ser string no vacío` };
  return { ok: true, value: body[field] };
}

module.exports = { isNonEmptyString, requireString };
