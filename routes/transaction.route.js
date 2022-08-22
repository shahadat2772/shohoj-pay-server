const express = require("express");
const { verifyJWT } = require("../controllers/jwt.controller");
const {
  getTransactionStatus,
  getSavings,
  userAllInfo,
} = require("../controllers/transaction.controller");
const router = express.Router();

router.get("/transactionStatus/:email", verifyJWT, getTransactionStatus);
router.get("/getSavings/:email", getSavings);
module.exports = router;
