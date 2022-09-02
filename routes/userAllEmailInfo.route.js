const express = require("express");
const { verifyJWT } = require("../controllers/jwt.controller");
const {
  userAllInfo,
  getAllTransaction,
  getTransactionAmountByType,
} = require("../controllers/userAllEmailInformation.controller");
const router = express.Router();
// GET USER EMAIL ALL INFORMATION
router.get("/user-all-info/:email", verifyJWT, userAllInfo);
// GET USER ALL TRANSACTION DATA
router.get("/all-transaction/:email", verifyJWT, getAllTransaction);
router.get("/get-transaction-amount-by-type/:email", verifyJWT, getTransactionAmountByType);
module.exports = router;
