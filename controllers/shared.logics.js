const balanceCollection = require("../models/balances.model");
const savingCollection = require("../models/savings.model");
const transactionCollection = require("../models/transactions.model");
const notificationCollection = require("../models/notifications.model");
const userCollection = require("../models/users.model");
const shohojPay = require("../models/admin/admin.model");

const date = new Date().toLocaleDateString();
const time = new Date().toLocaleTimeString();

// Services
exports.updateBalance = async (email, amount, fee = 0) => {
  const balanceInfo = await balanceCollection.findOne({ email });
  const lastBalance = Number(balanceInfo?.balance);
  const newBalance = (lastBalance + amount - fee).toFixed(2).toString();
  if (parseInt(newBalance) < 0) {
    return {
      message: "insufficient",
    };
  }
  if (fee > 0) {
    const { revenue } = await shohojPay.findOne({ id: "shohojPay" });
    const newRevenue = Number(revenue) + fee;
    const uDoc = {
      $set: {
        revenue: newRevenue.toFixed(2).toString(),
      },
    };
    const cutFeeResult = await shohojPay.updateOne({ id: "shohojPay" }, uDoc);
    if (cutFeeResult?.modifiedCount < 0) {
      return {
        message: "failed",
      };
    }
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
  if (parseInt(newSaving) < 0) {
    return {
      message: "insufficient",
    };
  }
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

// Notifications
exports.sendNotification = async (email, message) => {
  const receiver = userCollection.findOne({ email: email });
  const avatar = receiver?.avatar;
  const notification = {
    message,
    email,
    time,
    date,
    avatar,
    status: "unseen",
  };
  const sendNotificationResult = await notificationCollection.insertOne(
    notification
  );
  return sendNotificationResult;
};

// Admin
// exports.cutFee(email, amount) = async () => {

// }

// Merchant
