const balanceCollection = require("../models/balances.model");
const savingCollection = require("../models/savings.model");
const transactionCollection = require("../models/transactions.model");
const date = new Date().toLocaleDateString();

const updateBalance = async (email, amount) => {
  const balanceInfo = await balanceCollection.findOne({ email });
  const lastBalance = parseInt(balanceInfo?.balance);
  const newBalance = (lastBalance + amount).toString();
  const doc = {
    $set: {
      balance: newBalance,
    },
  };
  const result = await balanceCollection.updateOne({ email }, doc);
  return result;
};
const updateSaving = async (email, amount) => {
  const savingInfo = await savingCollection.findOne({ email });
  const lastSaving = parseInt(savingInfo?.saving);
  const newSaving = (lastSaving + amount).toString();
  const doc = {
    $set: {
      saving: newSaving,
    },
  };
  const result = await savingCollection.updateOne({ email }, doc);
  return result;
};
const addStatement = async (statement) => {
  const result = await transactionCollection.insertOne(statement);
  return result;
};

// ADD MONEY
exports.addMoney = async (req, res) => {
  const { addMoneyInfo } = req.body;
  const email = addMoneyInfo?.email;
  const amount = parseInt(addMoneyInfo?.amount);
  const result = updateBalance(email, amount);
  res.send(result);
};

// SEND MONEY
exports.sendMoney = async (req, res) => {
  const { sendMoneyInfo } = req?.body;
  const sendersEmail = sendMoneyInfo?.from;
  const receiversEmail = sendMoneyInfo?.to;
  const amount = parseInt(sendMoneyInfo?.amount);
  const updateSendersBalanceResult = updateBalance(sendersEmail, -amount);
  const sendersStatementResult = addStatement(sendMoneyInfo);
  const updateReceiversBalanceResult = updateBalance(receiversEmail, amount);
  const receiversStatement = {
    type: "receiveMoney",
    email: receiversEmail,
    from: sendersEmail,
    to: receiversEmail,
    amount: sendMoneyInfo?.amount,
    date: date,
  };
  const receiversStatementResult = addStatement(receiversStatement);
  res.send({
    updateSendersBalanceResult,
    sendersStatementResult,
    updateReceiversBalanceResult,
    receiversStatementResult,
  });
};

// Save Money
exports.saveMoney = async (req, res) => {
  const { saveMoneyInfo } = req.body;
  const email = saveMoneyInfo.email;
  const amount = parseInt(saveMoneyInfo?.amount);
  const updateBalanceResult = updateBalance(email, -amount);
  const updateSavingResult = updateSaving(email, amount);
  const savingStatementResult = addStatement(saveMoneyInfo);
  res.send({ updateBalanceResult, updateSavingResult, savingStatementResult });
};
