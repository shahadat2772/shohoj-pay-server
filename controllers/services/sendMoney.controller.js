const {
  getUserInfo,
  updateBalance,
  addStatement,
} = require("../shared.logics");

const date = new Date().toLocaleDateString();
const time = new Date().toLocaleTimeString();

// SEND MONEY
exports.sendMoney = async (req, res) => {
  const { sendMoneyInfo } = req?.body;
  const sendersEmail = sendMoneyInfo?.from;
  const receiversEmail = sendMoneyInfo?.to;

  if (sendersEmail === receiversEmail) {
    res.send({
      error: "You have entered your email as receiver's email.",
    });
    return;
  }

  const receiversInfo = await getUserInfo(receiversEmail);
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

  // For sender
  const sendersStatement = {
    ...sendMoneyInfo,
    userName: receiversInfo?.name,
    userEmail: receiversEmail,
  };
  const sendersStatementResult = await addStatement(sendersStatement);
  const updateReceiversBalanceResult = await updateBalance(
    receiversEmail,
    amount
  );

  // For receiver
  const receiversStatement = {
    ...sendMoneyInfo,
    name: receiversInfo?.name,
    type: "Receive Money",
    userName: sendMoneyInfo?.name,
    userEmail: sendersEmail,
    email: receiversEmail,
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
