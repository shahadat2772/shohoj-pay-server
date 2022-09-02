const express = require("express");
const { verifyJWT } = require("../controllers/jwt.controller");
const { getPaymentIntent } = require("../controllers/stripe.controller");
const router = express.Router();
// Getting payment intent
router.post("/create-payment-intent", verifyJWT, getPaymentIntent);
module.exports = router;
