const balanceCollection = require("../models/balances.model");
const savingCollection = require("../models/savings.model");
const transactionCollection = require("../models/transactions.model");
const userCollection = require("../models/users.model");
const date = new Date().toLocaleDateString();
const time = new Date().toLocaleTimeString();

exports.updateBalance = async (email, amount) => {
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
  } else {
    return {
      message: "failed",
    };
  }
};

exports.updateSaving = async (email, amount) => {
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

exports.addStatement = async (statement) => {
  const result = await transactionCollection.insertOne(statement);
  return result;
};

exports.getUserInfo = async (email) => {
  const user = await userCollection.findOne({ email });
  return user;
};
