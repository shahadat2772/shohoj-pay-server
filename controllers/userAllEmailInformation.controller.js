const balanceCollection = require("../models/balances.model");
const savingCollection = require("../models/savings.model");
const transactionCollection = require("../models/transactions.model");
exports.userAllInfo = async (req, res) => {
  const email = req.params.email;
  const filter = { email: email };
  const userBalance = await balanceCollection.findOne(filter);
  const userTransactionInfo = await transactionCollection
    .find(filter)
    .toArray();
  const userSavingsInfo = await savingCollection.findOne(filter);
  res.send({ userBalance, userTransactionInfo, userSavingsInfo });
};
