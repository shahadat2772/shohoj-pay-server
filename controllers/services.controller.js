const stripe = require("stripe")(process.env.STRIPE_KEY);

// Payment intent function
exports.getPaymentIntent = async (req, res) => {
  const { addAmount } = req.body;
  const payableAmount = addAmount * 100;
  const paymentIntents = await stripe.paymentIntents.create({
    amount: payableAmount,
    currency: "usd",
    payment_method_types: ["card"],
  });
  res.send({ clientSecret: paymentIntents.client_secret });
};
