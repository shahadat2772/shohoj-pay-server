const express = require("express");
const { jwtUser } = require("../controllers/jwt.controller");

const router = express.Router();

router.put("/jwtUser/:email", jwtUser);

module.exports = router;
