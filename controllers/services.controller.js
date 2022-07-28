const balanceCollection = require("../models/balances.model");
const transactionCollection = require("../models/transactions.model");

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

// ADD MONEY
exports.addMoney = async (req, res) => {
  const date = new Date().toLocaleDateString();

  const { addMoneyInfo } = req.body;
  console.log(addMoneyInfo);
  const addMoneyAmount = addMoneyInfo?.amount;
  const email = addMoneyInfo?.email;
  const filter = { email };
  const usersBalanceInfo = await balanceCollection.findOne(filter);
  console.log(usersBalanceInfo);
  const lastBalance = usersBalanceInfo?.balance;
  const newBalance = parseInt(lastBalance) + parseInt(addMoneyAmount);
  const doc = {
    $set: {
      balance: newBalance,
    },
  };
  const balanceUpdateResult = await balanceCollection.updateOne(filter, doc);
  console.log(balanceUpdateResult);
  const statement = {
    email: email,
    type: "addMoney",
    amount: addMoneyAmount,
    date: date,
  };
  const stateMentResult = await transactionCollection.insertOne(statement);
  console.log(stateMentResult);
  res.send(balanceUpdateResult, stateMentResult);
};

// Send Money
exports.sendMoney = (req, res) => {
  const { sandMoneyInfo } = req.body;
  console.log(sandMoneyInfo);
};
