const express = require("express");
const { createAccount } = require("../controllers/users.controller");
const router = express.Router();

router.post("/createAccount", createAccount);

module.exports = router;
