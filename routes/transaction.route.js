const express = require("express");
const { verifyJWT } = require("../controllers/jwt.controller");
const {
  getTransactionStatus,
} = require("../controllers/transaction.controller");
const router = express.Router();

router.get("/transactionStatus/:email", verifyJWT, getTransactionStatus);
module.exports = router;
