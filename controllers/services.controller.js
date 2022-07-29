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
  console.log(addMoneyInfo);
  const email = addMoneyInfo?.email;
  const addMoneyAmount = addMoneyInfo?.amount;
  const filter = { email };
  const usersBalanceInfo = await balanceCollection.findOne(filter);
  const lastBalance = usersBalanceInfo?.balance;
  const newBalance = (
    parseFloat(lastBalance) + parseInt(addMoneyAmount)
  ).toString();
  const doc = {
    $set: {
      balance: newBalance,
    },
  };
  const balanceUpdateResult = await balanceCollection.updateOne(filter, doc);
  if (balanceUpdateResult?.modifiedCount > 0) {
    const stateMentResult = await transactionCollection.insertOne(addMoneyInfo);
    res.send([balanceUpdateResult, stateMentResult]);
  }
};

// Send Money
exports.sendMoney = async (req, res) => {
  const { sendMoneyInfo } = req.body;
  // console.log(sendMoneyInfo);

  const sender = sendMoneyInfo?.from;
  const receiver = sendMoneyInfo?.to;
  const amount = sendMoneyInfo?.amount;

  // Updating senders balance
  const sendersFilter = { email: sender };
  const sendersBalanceInfo = await balanceCollection.findOne(sendersFilter);
  const sendersLastBalance = sendersBalanceInfo?.balance;
  const sendersNewBalance = (
    parseInt(sendersLastBalance) - parseInt(amount)
  ).toString();
  const sendersUpdatedBalance = {
    $set: {
      balance: sendersNewBalance,
    },
  };
  const sendersBalanceUpdateResult = await balanceCollection.updateOne(
    sendersFilter,
    sendersUpdatedBalance
  );
  const sendersStatementResult = await transactionCollection.insertOne(
    sendMoneyInfo
  );

  if (
    sendersBalanceUpdateResult?.modifiedCount > 0 &&
    sendersStatementResult?.insertedId
  ) {
    // Updating receivers balance
    const receiversFilter = { email: receiver };
    const receiversBalanceInfo = await balanceCollection.findOne(
      receiversFilter
    );
    const receiversLastBalance = receiversBalanceInfo?.balance;
    const receiversNewBalance = (
      parseInt(receiversLastBalance) + parseInt(amount)
    ).toString();
    const receiversUpdatedBalance = {
      $set: {
        balance: receiversNewBalance,
      },
    };
    const receiversBalanceUpdateResult = await balanceCollection.updateOne(
      receiversFilter,
      receiversUpdatedBalance
    );
    const receiversStatement = {
      type: "receiveMoney",
      email: receiver,
      from: sender,
      to: receiver,
      amount: amount,
      date: sendMoneyInfo?.date,
    };
    const receiversStatementResult = await transactionCollection.insertOne(
      receiversStatement
    );

    if (
      receiversBalanceUpdateResult?.modifiedCount > 0 &&
      receiversStatementResult.insertedId
    ) {
      res.send({
        message: "success",
      });
    }
  }
};
