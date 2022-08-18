const express = require("express");
const { getJwtToken } = require("../controllers/jwt.controller");

const router = express.Router();

router.get("/getjwttoken/:email", getJwtToken);

module.exports = router;
