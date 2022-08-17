const express = require("express");
const { jwtUser } = require("../controllers/jwt.controller");

const router = express.Router();

router.get("/jwtUser/:email", jwtUser);

module.exports = router;
