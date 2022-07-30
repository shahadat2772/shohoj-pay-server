const { getPaymentIntent } = require("../controllers/stripe.controller");
const router = express.Router();

// Getting payment intent
router.post("/create-payment-intent", getPaymentIntent);
module.exports = router;
