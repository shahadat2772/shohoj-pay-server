const express = require("express");
const {
  verifyAdmin,
  makeAdmin,
  getShohojPayInfo,
  manageAdmin,
  getAllAdmin,
} = require("../../controllers/admin/admin.controller");
const { verifyJWT } = require("../../controllers/jwt.controller");
const { getAllUser } = require("../../controllers/users.controller");

const router = express.Router();

router.get("/getShohojPayInfo", verifyJWT, verifyAdmin, getShohojPayInfo);
router.put("/manageAdmin", verifyJWT, verifyAdmin, manageAdmin);
router.get("/getAllAdmin", verifyJWT, verifyAdmin, getAllAdmin);

module.exports = router;
