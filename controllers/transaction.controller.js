const savingCollection = require("../models/savings.model");
const transactionCollection = require("../models/transactions.model");

exports.getTransactionStatus = async (req, res) => {
  const email = req.params.email;
  const filter = { email: email };
  const userSavingsInfo = await transactionCollection.find(filter).toArray();
  //   const userSavingsInfo = await transactionCollection.find().toArray();
  res.send(userSavingsInfo);
};
exports.getSavings = async (req, res) => {
  const email = req.params.email;
  const filter = { email: email };
  const userSavingsInfo = await savingCollection.findOne(filter);
  res.send(userSavingsInfo);
};
