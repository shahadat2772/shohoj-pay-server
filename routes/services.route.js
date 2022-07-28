const express = require("express");

// Getting the router from express
const router = express.Router();
// Importing controllers
const { getPaymentIntent } = require("../controllers/services.controller");

// CREATE-STRIPE-PAYMENT-INTENT
router.post("/create-payment-intent", getPaymentIntent);

// Exporting the router for app.js
module.exports = router;
