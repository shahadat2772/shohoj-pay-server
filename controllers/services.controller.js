const balanceCollection = require("../models/balances.model");
const transactionCollection = require("../models/transactions.model");
const stripe = require("stripe")(process.env.STRIPE_KEY);
const date = new Date().toLocaleDateString();

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

// ADD MONEY
exports.addMoney = async (req, res) => {
  const { addMoneyInfo } = req.body;
  const email = addMoneyInfo?.email;
  const addMoneyAmount = addMoneyInfo?.amount;
  const filter = { email };
  const usersBalanceInfo = await balanceCollection.findOne(filter);
  const lastBalance = usersBalanceInfo?.balance;
  const newBalance = parseInt(lastBalance) + parseInt(addMoneyAmount);
  const doc = {
    $set: {
      balance: newBalance,
    },
  };
  const balanceUpdateResult = await balanceCollection.updateOne(filter, doc);

  if (balanceUpdateResult?.modifiedCount > 0) {
    const statement = {
      email: email,
      type: "addMoney",
      amount: addMoneyAmount,
      date: date,
    };
    const stateMentResult = await transactionCollection.insertOne(statement);
    res.send([balanceUpdateResult, stateMentResult]);
  }
};

// Send Money
exports.sendMoney = (req, res) => {
  const { sandMoneyInfo } = req.body;

  const senders = sandMoneyInfo?.from;
  const to = sandMoneyInfo?.to;
  const amount = sandMoneyInfo?.amount;
};
