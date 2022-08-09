const {
  getUserInfo,
  addStatement,
  updateBalance,
} = require("../shared.logics");
const requestCollection = require("../../models/moneyRequests.model");
const userCollection = require("../../models/users.model");
const { ObjectId, ObjectID } = require("mongodb");

const date = new Date().toLocaleDateString();
const time = new Date().toLocaleTimeString();

// Request Money
exports.requestMoney = async (req, res) => {
  const { requestMoneyInfo } = req?.body;
  const from = requestMoneyInfo?.from;
  const to = requestMoneyInfo?.to;
  if (from === to) {
    res.send({
      error: "You have entered your email to request money from.",
    });
    return;
  }
  const amount = requestMoneyInfo?.amount;
  const donorInfo = await getUserInfo(to);
  if (!donorInfo) {
    res.send({
      error: "Sender not found.",
    });
    return;
  }
  // Inserting the money request
  const moneyRequest = {
    ...requestMoneyInfo,
    donorName: donorInfo?.name,
  };
  // console.log("Money request info", moneyRequest);
  const moneyRequestResult = await requestCollection.insertOne(moneyRequest);
  if (moneyRequestResult.insertedId) {
    res.send({
      success: `$${amount} requested successfully.`,
    });
  } else {
    res.send({
      error: `Doh! something terrible happened.`,
    });
  }
};

exports.approveMoneyRequest = async (req, res) => {
  const { requestMoneyInfo } = req?.body;

  const requesterName = requestMoneyInfo?.requesterName;
  const donorName = requestMoneyInfo?.donorName;
  const requesterEmail = requestMoneyInfo?.from;
  const donorEmail = requestMoneyInfo?.to;

  const amount = parseInt(requestMoneyInfo?.amount);
  // Adding statement and updating balance for donor
  const donorsBalanceUpdate = await updateBalance(donorEmail, -amount);
  if (donorsBalanceUpdate.message === "insufficient") {
    res.send({
      error: "Insufficient balance.",
    });
    return;
  }
  const donorStatement = {
    ...requestMoneyInfo,
    userName: requesterName,
    userEmail: requesterEmail,
    name: donorName,
    email: donorEmail,
    status: "Approved",
    time,
    date,
  };
  delete donorStatement.requesterName;
  delete donorStatement.donorName;
  delete donorStatement._id;
  // console.log("donor statement", donorStatement);
  const donorsStatementResult = await addStatement(donorStatement);

  // Adding statement and updating balance for requester
  const requestersBalanceUpdate = await updateBalance(requesterEmail, amount);
  const requesterStatement = {
    ...donorStatement,
    type: "Receive Money",
    name: requesterName,
    email: requesterEmail,
    userName: donorName,
    userEmail: donorEmail,
  };
  delete requesterStatement._id;
  // console.log("requester statement", requesterStatement);
  const requesterStatementResult = await addStatement(requesterStatement);

  // Updating the money request
  const updatedMoneyRequest = {
    $set: {
      status: "Approved",
    },
  };
  const moneyRequestFilter = { _id: ObjectId(requestMoneyInfo._id) };
  const moneyRequestUpdateResult = await requestCollection.updateOne(
    moneyRequestFilter,
    updatedMoneyRequest
  );

  if (
    donorsStatementResult.insertedId &&
    requestersBalanceUpdate.message === "success" &&
    requesterStatementResult.insertedId &&
    moneyRequestUpdateResult.modifiedCount > 0
  ) {
    res.send({
      success: `Money request for $${amount} approved.`,
    });
  } else {
    res.send({
      error: `Could not approve the money request.`,
    });
  }
};

// Get requests
exports.getRequests = async (req, res) => {
  const email = req.headers?.email;
  const type = req.headers?.type;
  let filter;
  if (type === "incoming") {
    filter = { to: email };
  } else {
    filter = { from: email };
  }
  const requestsResult = await requestCollection.find(filter).toArray();
  res.send(requestsResult);
};
