const express = require("express");
const router = express.Router();

const { ping, masCaracteres } = require("../controllers/strings.controller");

router.get("/ping", ping);

// 1) mascaracteres
router.post("/mascaracteres", masCaracteres);

module.exports = router;
