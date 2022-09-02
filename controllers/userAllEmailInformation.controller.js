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

exports.getTransactionAmountByType = async (req, res) => {
  const email = req.params.email;
  const addedMoney = await transactionCollection.find({ email: email, type: "Add Money" }).toArray();
  const gotPaid = await transactionCollection.find({ email: email, type: "Receive Money", }).toArray();
  const mToM = await transactionCollection.find({ email: email, type: "M to M", }).toArray();
  const mToP = await transactionCollection.find({ email: email, type: "M to P", }).toArray();
  const getSum = (total, amount) => parseFloat(total) + parseFloat(amount);
  const totalAddedMoney = await addedMoney.map(x => x.amount).reduce(getSum, 0);
  const totalgotPaid = await gotPaid.map(x => x.amount).reduce(getSum, 0);
  const totalmToM = await mToM.map(x => x.amount).reduce(getSum, 0);
  const totalmToP = await mToP.map(x => x.amount).reduce(getSum, 0)

  res.send([
    { name: "Added", value: totalAddedMoney, color: "#0088FE" },
    { name: "Got Paid", value: totalgotPaid, color: "#00C49F" },
    { name: "Sent", value: totalmToM + totalmToP, color: "#FFBB28" },
  ])
}
