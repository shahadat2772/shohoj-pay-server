const {
  getUserInfo,
  addStatement,
  updateBalance,
} = require("../shared.logics");
const requestCollection = require("../../models/moneyRequests.model");

const date = new Date().toLocaleDateString();
const time = new Date().toLocaleTimeString();

// Request Money
exports.requestMoney = async (req, res) => {
  const { requestMoneyInfo } = req?.body;
  const to = requestMoneyInfo?.to;
  const amount = requestMoneyInfo?.amount;
  const donorInfo = await getUserInfo(to);
  if (!donorInfo) {
    res.send({
      error: "Sender not found.",
    });
    return;
  }
  const moneyRequest = {
    ...requestMoneyInfo,
    donorName: donorInfo?.name,
  };
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
  const amount = parseInt(requestMoneyInfo?.amount);
  const requesterEmail = requestMoneyInfo?.from;
  const donorEmail = requestMoneyInfo?.to;
  const donorsBalanceUpdate = await updateBalance(donorEmail, -amount);
  if (donorsBalanceUpdate.message === "insufficient") {
    res.send({
      error: "Insufficient balance.",
    });
    return;
  }
  const donorStatement = {
    ...requestMoneyInfo,
    name: requestMoneyInfo?.requesterName,
    email: requestMoneyInfo.to,
    status: "approved",
    time,
    date,
  };
  delete donorStatement.requesterName;
  delete donorStatement.donorName;
  const donorsStatementResult = await addStatement(donorStatement);

  const requestersBalanceUpdate = await updateBalance(requesterEmail, amount);
  const requesterStatement = {
    ...donorStatement,
    name: requestMoneyInfo.donorName,
    email: requestMoneyInfo.from,
  };
  const requesterStatementResult = await addStatement(requesterStatement);

  if (
    donorsStatementResult.insertedId &&
    requestersBalanceUpdate.message === "success" &&
    requesterStatementResult.insertedId
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
// exports.getRequests = async (req, res) => {
//   const { email, type } = req?.body;
//   // const email = req.headers?.email;
//   // const type = req.headers?.type;
//   console.log(email, type);
//   let filter;
//   if (type === "incoming") {
//     filter = { to: email };
//   } else {
//     filter = { from: email };
//   }
//   const requests = await requestCollection.find(filter);
//   const users = await userCollection.find({});
//   console.log(users);
//   res.send(users);
// };
