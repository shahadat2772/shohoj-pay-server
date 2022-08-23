const express = require("express");
const {
  verifyAdmin,
  getShohojPayInfo,
  manageAdmin,
  getAllAdmin,
  getAllUser,
  updateAccountStatus,
} = require("../../controllers/admin/admin.controller");
const { verifyJWT } = require("../../controllers/jwt.controller");

const router = express.Router();

router.get("/getShohojPayInfo", verifyJWT, verifyAdmin, getShohojPayInfo);
router.put("/manageAdmin", verifyJWT, verifyAdmin, manageAdmin);
router.get("/getAllAdmin", verifyJWT, verifyAdmin, getAllAdmin);
router.get("/getAllUser", verifyJWT, verifyAdmin, getAllUser);
router.put("/updateAccountStatus", verifyJWT, verifyAdmin, updateAccountStatus);

module.exports = router;
