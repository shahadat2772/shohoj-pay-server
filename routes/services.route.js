const express = require("express");
const { verifyJWT } = require("../controllers/jwt.controller");
const { verifyMerchant } = require("../controllers/merchant.controller");
const router = express.Router();
const { addMoney } = require("../controllers/services/addMoney.controller");
const { requestBusinessLoan } = require("../controllers/services/businessLoan.controller");
const { eCheckInfo } = require("../controllers/services/eCheck.controller");
const {
  getServices,
  getAllService,
} = require("../controllers/services/getServices.controller");

const {
  merchantToMerchant,
} = require("../controllers/services/merchantToMerchant.controller");
const {
  mechantToPersonal,
} = require("../controllers/services/merchantToPersonal.controller");
const {
  personalToMerchant,
} = require("../controllers/services/personalToMerchant.controller");

const {
  requestMoney,
  approveMoneyRequest,
  getRequests,
} = require("../controllers/services/requestMoney.controller");
const { saveMoney } = require("../controllers/services/saveMoney.controller");
const { sendMoney } = require("../controllers/services/sendMoney.controller");
const {
  withdrawSavings,
} = require("../controllers/services/withdrawSavings.controller");

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
// E-check
router.post("/eCheck", eCheckInfo);
// WITHDRAW SAVINGS
router.post("/withdraw-savings", withdrawSavings);
// Get requests
router.get("/getRequests", getRequests);
// Get services
router.get("/getServices", getServices);
// Get All Service
router.get("/all-service", getAllService);

// Merchant Services Routes

// Merchant to Personal
router.post(
  "/merchant-to-personal",
  verifyJWT,
  verifyMerchant,
  mechantToPersonal
);
// Personal to Merchant
router.post("/personal-to-merchant", personalToMerchant);

// merchant to merchant
router.post(
  "/merchant-to-merchant",
  verifyJWT,
  verifyMerchant,
  merchantToMerchant
);

// business loan
router.post("/request-business-loan",
  verifyJWT,
  verifyMerchant,
  requestBusinessLoan
)

module.exports = router;
