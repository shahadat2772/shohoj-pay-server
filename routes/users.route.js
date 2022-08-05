const express = require("express");
const {
  createAccount,
  getUserInfo,
  updateUserInfo,
} = require("../controllers/users.controller");
const router = express.Router();

router.post("/createAccount", createAccount);
router.get("/getUserInfo", getUserInfo);
router.put("/updateUserInfo", updateUserInfo)

module.exports = router;
