const express = require("express");
const router = express.Router();
const {
  getPaymentIntent,
  sendMoney,
  addMoney,
} = require("../controllers/services.controller");

// Getting payment intent
router.post("/create-payment-intent", getPaymentIntent);

// Add Money
router.post("/addMoney", addMoney);
// Send Money
router.post("/sendMoney", sendMoney);

module.exports = router;
