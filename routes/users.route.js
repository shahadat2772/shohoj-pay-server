const express = require("express");
const {
  createAccount,
  getUserInfo,
  updateUserInfo,
  emailExists,
} = require("../controllers/users.controller");

const router = express.Router();

router.post("/createAccount", createAccount);
router.get("/getUserInfo", getUserInfo);
router.put("/updateUserInfo", updateUserInfo);
router.get("/checkemailexists/:email", emailExists);

module.exports = router;
