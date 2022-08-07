const express = require("express");

const { getUserBalance } = require("../controllers/balance.controller");
const { verifyJWT } = require("../controllers/jwt.controller");
const router = express.Router();

router.get("/getUserBalances/:email", verifyJWT, getUserBalance);
module.exports = router;
