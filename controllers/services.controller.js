const balanceCollection = require("../models/balances.model");
const savingCollection = require("../models/savings.model");
const transactionCollection = require("../models/transactions.model");
const userCollection = require("../models/users.model");
const date = new Date().toLocaleDateString();

const updateBalance = async (email, amount) => {
  const balanceInfo = await balanceCollection.findOne({ email });
  const lastBalance = parseInt(balanceInfo?.balance);
  const newBalance = (lastBalance + amount).toString();
  if (parseInt(newBalance) < 0) {
    return {
      message: "insufficient",
    };
  }
  const doc = {
    $set: {
      balance: newBalance,
    },
  };
  const result = await balanceCollection.updateOne({ email }, doc);
  if (result.modifiedCount > 0) {
    return {
      message: "success",
    };
  }
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

const isExists = async (email) => {
  const user = await userCollection.findOne({ email });
  return user;
};

// ADD MONEY
exports.addMoney = async (req, res) => {
  const { addMoneyInfo } = req.body;
  const email = addMoneyInfo?.email;
  const amount = parseInt(addMoneyInfo?.amount);
  const result = await updateBalance(email, amount);
  res.send(result);
};

// SEND MONEY
exports.sendMoney = async (req, res) => {
  const { sendMoneyInfo } = req?.body;
  const sendersEmail = sendMoneyInfo?.from;
  const receiversEmail = sendMoneyInfo?.to;
  const receiversInfo = await isExists(receiversEmail);
  if (!receiversInfo) {
    res.send({
      error: "Receiver not found.",
    });
    return;
  }
  const amount = parseInt(sendMoneyInfo?.amount);
  const updateSendersBalanceResult = await updateBalance(sendersEmail, -amount);
  if (updateSendersBalanceResult.message === "insufficient") {
    res.send({
      error: "Insufficient balance.",
    });
    return;
  }
  const sendersStatementResult = await addStatement(sendMoneyInfo);
  const updateReceiversBalanceResult = await updateBalance(
    receiversEmail,
    amount
  );
  const receiversStatement = {
    type: "receiveMoney",
    email: receiversEmail,
    from: sendersEmail,
    to: receiversEmail,
    amount: sendMoneyInfo?.amount,
    date: date,
  };
  const receiversStatementResult = await addStatement(receiversStatement);
  if (
    sendersStatementResult?.insertedId &&
    updateReceiversBalanceResult?.message === "success" &&
    receiversStatementResult?.insertedId
  ) {
    res.send({ success: `$${amount} sended success fully.` });
  }
};

// Save Money
exports.saveMoney = async (req, res) => {
  const { saveMoneyInfo } = req.body;
  const email = saveMoneyInfo.email;
  const amount = parseInt(saveMoneyInfo?.amount);
  const updateBalanceResult = await updateBalance(email, -amount);
  if (updateBalanceResult.message === "insufficient") {
    res.send({
      error: "insufficient Balance.",
    });
    return;
  }
  const updateSavingResult = await updateSaving(email, amount);
  const savingStatementResult = await addStatement(saveMoneyInfo);
  if (
    updateBalanceResult.message == "success" &&
    updateSavingResult.modifiedCount > 0 &&
    savingStatementResult.insertedId
  ) {
    res.send({
      success: `$${amount} saved successfully`,
    });
  } else {
    res.send({
      error: "Doh, something terrible happened.",
    });
  }
};
