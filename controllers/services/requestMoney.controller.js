const {
  getUserInfo,
  addStatement,
  updateBalance,
  sendNotification,
} = require("../shared.logics");
const requestCollection = require("../../models/moneyRequests.model");
const { ObjectId, ObjectID } = require("mongodb");

const fullDate = new Date().toLocaleDateString();
const date = new Date().toLocaleDateString("en-us", {
  year: "numeric",
  month: "short",
});
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
  const donorImage = donorInfo?.avatar;
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
  const donorInfo = await getUserInfo(donorEmail);
  const donorImage = donorInfo?.avatar;
  const amount = parseInt(requestMoneyInfo?.amount);
  const fee = Number((amount * 0.01).toFixed(2));
  // // let fee = 0;
  // const requesterInfo = await getUserInfo(donorEmail);
  // // if (requesterInfo.type === "merchant") fee = 5;
  // Adding statement and updating balance for donor
  const donorsBalanceUpdate = await updateBalance(donorEmail, -amount, fee);
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
    fullDate,
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
    image: donorImage,
  };
  delete requesterStatement._id;
  // console.log("requester statement", requesterStatement);
  const requesterStatementResult = await addStatement(requesterStatement);
  // RECEIVER NOTIFICATION
  const requesterNotification = `your request of $${amount} has been received from ${donorEmail}.`;
  const senderNotification = await sendNotification(
    requesterEmail,
    requesterNotification
  );
  // RECEIVER NOTIFICATION
  const donorNotification = `You have successfully send money of $${amount}, to ${requesterEmail}.`;
  const donorNotificationResult = await sendNotification(
    donorEmail,
    donorNotification
  );

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
    senderNotification.insertedId &&
    donorNotificationResult.insertedId &&
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
