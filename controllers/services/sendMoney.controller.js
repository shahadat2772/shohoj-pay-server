const {
  getUserInfo,
  updateBalance,
  addStatement,
  sendNotification,
} = require("../shared.logics");

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
  const receiverImage = receiversInfo?.avatar;
  if (!receiversInfo) {
    res.send({
      error: "Receiver not found.",
    });
    return;
  } else if (receiversInfo.type !== "personal") {
    res.send({
      error: "Receiver is not a Personal user",
    });
    return;
  }
  const amount = parseInt(sendMoneyInfo?.amount);
  const fee = Number((amount * 0.01).toFixed(2));
  console.log(fee);
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
    image: receiverImage,
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
  // RECEIVER NOTIFICATION
  const receiverNotification = `You have received $${sendMoneyInfo.amount}, from ${sendersEmail}.`;
  const receiverNotificationResult = await sendNotification(
    receiversEmail,
    receiverNotification
  );
  // SENDER NOTIFICATION
  const senderNotification = `You have successfully send money of $${sendMoneyInfo.amount}, to ${sendersEmail}.`;
  const senderNotificationResult = await sendNotification(
    sendersEmail,
    senderNotification
  );

  if (
    sendersStatementResult?.insertedId &&
    updateReceiversBalanceResult?.message === "success" &&
    receiversStatementResult?.insertedId &&
    receiverNotificationResult.insertedId &&
    senderNotificationResult.insertedId
  ) {
    res.send({ success: `$${amount} sended success fully.` });
  }
};
