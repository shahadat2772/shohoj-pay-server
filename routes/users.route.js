const express = require("express");
const {
  createAccount,
  getUserInfo,
  updateUserInfo,
  getAllUser,
} = require("../controllers/users.controller");
const { verifyAdmin } = require("../controllers/admin.controller");
const router = express.Router();

router.post("/createAccount", createAccount);
router.get("/getUserInfo", getUserInfo);
router.get("/getalluser", verifyAdmin, getAllUser)
router.put("/updateUserInfo", updateUserInfo)

module.exports = router;
