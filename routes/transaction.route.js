const express = require("express");
const {
  getTransactionStatus,
} = require("../controllers/transaction.controller");
const router = express.Router();

router.get("/transactionStatus/:email", getTransactionStatus);
module.exports = router;
