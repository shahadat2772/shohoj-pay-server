const userCollection = require("../models/users.model");
const balanceCollection = require("../models/balances.model");
const savingCollection = require("../models/savings.model");
const jwt = require("jsonwebtoken");
exports.createAccount = async (req, res) => {
  const { userInfo } = req.body;
  const userResult = await userCollection.insertOne(userInfo);

  const email = userInfo?.email;
  const userBalance = {
    email,
    balance: "25",
  };

  const userSaving = {
    email,
    saving: "0",
  };
  const balanceResult = await balanceCollection.insertOne(userBalance);
  const savingResult = await savingCollection.insertOne(userSaving);
  res.send({ userResult, balanceResult, savingResult });
};

exports.getUserInfo = async (req, res) => {
  const email = req.headers.email;
  const filter = { email: email };
  const userInfo = await userCollection.findOne(filter);
  res.send(userInfo);
};

exports.updateUserInfo = async (req, res) => {
  const email = req.headers.email;
  const filter = { email: email };
  const updatedUser = req.body;
  const doc = {
    $set: {
      ...updatedUser,
    },
  };
  const userInfo = await userCollection.updateOne(filter, doc, {
    upsert: true,
  });
  res.send(userInfo);
};

exports.emailExists = async (req, res) => {
  const email = req.params.email;
  const result = await userCollection.find({ email: email }).toArray();
  if (result.length) {
    res.send({ error: "this email is already used" });
  } else {
    res.send({ success: "it's available" });
  }
};
