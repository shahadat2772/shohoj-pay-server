const express = require("express");
const { saveUserInfo } = require("../controllers/users.controller");
const router = express.Router();

router.post("/saveUser", saveUserInfo);

module.exports = router;
