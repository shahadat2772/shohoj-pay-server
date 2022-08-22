const {
  getUserInfo,
  updateBalance,
  addStatement,
  sendNotification,
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
  const fee = parseInt(sendMoneyInfo?.fee);
  const updateSendersBalanceResult = await updateBalance(
    sendersEmail,
    -amount,
    fee
  );
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
  // console.log("Senders Statement", sendersStatement);
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
  // console.log("Receivers Statement", receiversStatement);
  const receiversStatementResult = await addStatement(receiversStatement);

  const notificationMessage = `You have received $${sendMoneyInfo.amount}, from ${sendersEmail}.`;
  const sendNotificationResult = await sendNotification(
    receiversEmail,
    notificationMessage
  );

  if (
    sendersStatementResult?.insertedId &&
    updateReceiversBalanceResult?.message === "success" &&
    receiversStatementResult?.insertedId &&
    sendNotificationResult.insertedId
  ) {
    res.send({ success: `$${amount} sended success fully.` });
  }
};
