const express = require("express");
const {
  userAllInfo,
} = require("../controllers/userAllEmailInformation.controller");
const router = express.Router();
router.get("/user-all-info/:email", userAllInfo);
module.exports = router;
