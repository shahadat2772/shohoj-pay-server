const express = require("express");
const {
  createAccount,
  getUserInfo,
} = require("../controllers/users.controller");
const router = express.Router();

router.post("/createAccount", createAccount);
router.get("/getUserInfo", getUserInfo);

module.exports = router;
