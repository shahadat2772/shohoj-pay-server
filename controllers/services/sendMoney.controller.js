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
  // console.log("send money info", sendMoneyInfo);
  const sendersEmail = sendMoneyInfo?.from;
  const receiversEmail = sendMoneyInfo?.to;
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
  const sendersStatement = {
    ...sendMoneyInfo,
    userName: receiversInfo?.name,
    userEmail: receiversEmail,
  };
  // console.log("Sender statement", sendersStatement);
  const sendersStatementResult = await addStatement(sendersStatement);
  const updateReceiversBalanceResult = await updateBalance(
    receiversEmail,
    amount
  );
  const receiversStatement = {
    ...sendMoneyInfo,
    name: receiversInfo?.name,
    type: "Receive Money",
    userName: sendMoneyInfo?.name,
    userEmail: sendersEmail,
    email: receiversEmail,
  };
  // console.log("Receivers statement", receiversStatement);
  const receiversStatementResult = await addStatement(receiversStatement);
  if (
    sendersStatementResult?.insertedId &&
    updateReceiversBalanceResult?.message === "success" &&
    receiversStatementResult?.insertedId
  ) {
    res.send({ success: `$${amount} sended success fully.` });
  }
};
