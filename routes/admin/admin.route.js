const express = require("express");
const {
  verifyAdmin,
  makeAdmin,
  getShohojPayInfo,
} = require("../../controllers/admin/admin.controller");
const { getAllUser } = require("../../controllers/users.controller");

const router = express.Router();

router.get("/getalluser", verifyAdmin, getAllUser);
router.put("/makeadmin/:email", verifyAdmin, makeAdmin);
router.get("/getShohojPayInfo", getShohojPayInfo);

module.exports = router;
