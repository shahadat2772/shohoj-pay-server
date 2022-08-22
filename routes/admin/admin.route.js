const express = require("express");
const {
  verifyAdmin,
  makeAdmin,
  getShohojPayInfo,
  manageAdmin,
} = require("../../controllers/admin/admin.controller");
const { verifyJWT } = require("../../controllers/jwt.controller");
const { getAllUser } = require("../../controllers/users.controller");

const router = express.Router();

router.get("/getShohojPayInfo", verifyJWT, verifyAdmin, getShohojPayInfo);
router.put("/manageAdmin", verifyJWT, verifyAdmin, manageAdmin);

module.exports = router;
