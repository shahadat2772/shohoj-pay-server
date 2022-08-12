const express = require("express");
const router = express.Router();
const { addMoney } = require("../controllers/services/addMoney.controller");
const {
  getServices,
} = require("../controllers/services/getServices.controller");

const {
  requestMoney,
  approveMoneyRequest,
  getRequests,
} = require("../controllers/services/requestMoney.controller");
const { saveMoney } = require("../controllers/services/saveMoney.controller");
const { sendMoney } = require("../controllers/services/sendMoney.controller");

// Add Money
router.post("/addMoney", addMoney);
// Send Money
router.post("/sendMoney", sendMoney);
// Request Money
router.post("/requestMoney", requestMoney);
// Save Money
router.post("/saveMoney", saveMoney);
// Approve money request
router.post("/approveRequestMoney", approveMoneyRequest);
// Get requests
router.get("/getRequests", getRequests);
// Get requests
router.get("/getServices", getServices);

module.exports = router;
