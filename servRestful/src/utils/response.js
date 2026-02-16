function ok(res, data = {}) {
  return res.json({ ok: true, ...data });
}

function fail(res, message, details = null, status = 400) {
  return res.status(status).json({
    ok: false,
    error: message,
    ...(details ? { details } : {})
  });
}

module.exports = { ok, fail };
