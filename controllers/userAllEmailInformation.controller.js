const balanceCollection = require("../models/balances.model");
const savingCollection = require("../models/savings.model");
const transactionCollection = require("../models/transactions.model");
const userCollection = require("../models/users.model");
exports.userAllInfo = async (req, res) => {
  const email = req.params.email;
  const filter = { email: email };
  const generalInfo = await userCollection.findOne(filter);
  const userBalance = await balanceCollection.findOne(filter);
  const userTransactionInfo = await transactionCollection
    .find(filter)
    .toArray();
  const userSavingsInfo = await savingCollection.findOne(filter);
  res.send({ generalInfo, userBalance, userTransactionInfo, userSavingsInfo });
};
exports.getAllTransaction = async (req, res) => {
  const email = req.params.email;
  const filter = { email: email };
  const userTransactionInfo = await transactionCollection
    .find(filter)
    .toArray();
  res.send(userTransactionInfo);
};
