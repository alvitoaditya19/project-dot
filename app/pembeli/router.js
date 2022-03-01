var express = require("express");
var router = express.Router();
const {index,landingPage, category  } = require("./controller");

router.get("/", index);
router.get("/landingpage", landingPage);

router.get("/category", category);


module.exports = router;
 