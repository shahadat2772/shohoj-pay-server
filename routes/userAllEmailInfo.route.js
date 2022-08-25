const express = require("express");
const {
  userAllInfo,
  getAllTransaction,
} = require("../controllers/userAllEmailInformation.controller");
const router = express.Router();
// GET USER EMAIL ALL INFORMATION
router.get("/user-all-info/:email", userAllInfo);
// GET USER ALL TRANSACTION DATA
router.get("/all-transaction/:email", getAllTransaction);
module.exports = router;
