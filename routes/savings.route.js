const express = require("express");
const { getSavingsBalance } = require("../controllers/savings.controller");
const router = express.Router();

router.get("/userSavings", getSavingsBalance);
module.exports = router;
