const express = require("express");
const { verifyJWT } = require("../controllers/jwt.controller");
const {
  userAllInfo,
  getAllTransaction,
} = require("../controllers/userAllEmailInformation.controller");
const router = express.Router();
// GET USER EMAIL ALL INFORMATION
router.get("/user-all-info/:email", verifyJWT, userAllInfo);
// GET USER ALL TRANSACTION DATA
router.get("/all-transaction/:email", verifyJWT, getAllTransaction);
module.exports = router;
