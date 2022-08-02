const express = require("express");
const router = express.Router();
const {
  getPaymentIntent,
  sendMoney,
  addMoney,
  saveMoney,
} = require("../controllers/services.controller");

// Add Money
router.post("/addMoney", addMoney);
// Send Money
router.post("/sendMoney", sendMoney);
// Save Money
router.post("/saveMoney", saveMoney);

module.exports = router;
