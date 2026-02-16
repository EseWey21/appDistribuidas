const express = require("express");
const router = express.Router();

const {
	ping,
	masCaracteres,
	menosCaracteres,
    numCaracteres, 
	palindroma,
	concat,
	applysha256,
	verifysha256,
} = require("../controllers/strings.controller");

router.get("/ping", ping);

// 1) mascaracteres
router.post("/mascaracteres", masCaracteres);

// 2) menoscaracteres
router.post("/menoscaracteres", menosCaracteres);

// 3) numcaracteres
router.post("/numcaracteres", numCaracteres);

// 4) palindroma
router.post("/palindroma", palindroma);

// 5) concat
router.post("/concat", concat);

// 6) applysha256
router.post("/applysha256", applysha256);

// 7) verifysha256
router.post("/verifysha256", verifysha256);

module.exports = router;
