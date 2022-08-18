const express = require("express");
const {
  createAccount,
  getUserInfo,
  updateUserInfo,
  getAllUser,
  emailExists,
} = require("../controllers/users.controller");
const { verifyAdmin, makeAdmin } = require("../controllers/admin.controller");
const { verifyMerchant } = require("../controllers/merchant.controller");
const router = express.Router();

router.post("/createAccount", createAccount);
router.get("/getUserInfo", getUserInfo);
router.get("/getalluser", verifyAdmin, getAllUser)
router.put("/updateUserInfo", updateUserInfo)
router.put("/makeadmin/:email", verifyAdmin, makeAdmin);
router.get("/checkmerchant", verifyMerchant)
router.get("/checkemailexists/:email", emailExists)

module.exports = router;
