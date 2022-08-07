const { isUserExists, addStatement } = require("../shared.logics");

const date = new Date().toLocaleDateString();
const time = new Date().toLocaleTimeString();

// Request Money
exports.requestMoney = async (req, res) => {
  const { requestMoneyInfo } = req?.body;

  const from = requestMoneyInfo?.from;
  const to = requestMoneyInfo?.to;
  const amount = requestMoneyInfo?.amount;

  const sendersInfo = await isUserExists(to);
  if (!sendersInfo) {
    res.send({
      error: "Sender not found.",
    });
    return;
  }
  const requestersStatement = {
    type: "requestMoney",
    status: "pending",
    name: sendersInfo?.name,
    amount: amount,
    email: from,
    from: from,
    to: to,
    date,
    time,
  };
  const requestersStatementResult = await addStatement(requestersStatement);
  const sendersStatement = {
    type: "requestMoney",
    status: "pending",
    name: requestMoneyInfo?.name,
    amount: amount,
    email: to,
    from: from,
    to: to,
    date,
    time,
  };
  const sendersStatementResult = await addStatement(sendersStatement);

  if (
    requestersStatementResult.insertedId &&
    sendersStatementResult.insertedId
  ) {
    res.send({
      success: `$${amount} requested successfully.`,
    });
  } else {
    res.send({
      error: "Doh, something terrible happened.",
    });
  }
};
