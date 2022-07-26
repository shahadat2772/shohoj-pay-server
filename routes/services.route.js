const express = require("express");
const router = express.Router();
const { getPaymentIntent } = require("../controllers/services.controller");

// CREATE-STRIPE-PAYMENT-INTENT
router.post("/create-payment-intent", getPaymentIntent);
module.exports = router;
