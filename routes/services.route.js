const express = require("express");
const router = express.Router();
const { getPaymentIntent } = require("../controllers/services.controller");

// Getting payment intent
router.post("/create-payment-intent", getPaymentIntent);

// Add Money
// router.post("/addMoney", addMoney);

module.exports = router;
