const express = require("express");
const router = express.Router();

const {
	ping,
	masCaracteres,
	menosCaracteres,
} = require("../controllers/strings.controller");

router.get("/ping", ping);

// 1) mascaracteres
router.post("/mascaracteres", masCaracteres);

// 2) menoscaracteres
router.post("/menoscaracteres", menosCaracteres);

module.exports = router;
