const express = require("express");
const { getUserBalance } = require("../controllers/balance.controller");
const router = express.Router();

router.get("/getUserBalances/:email", getUserBalance);
module.exports = router;
