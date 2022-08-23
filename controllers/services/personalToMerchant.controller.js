const {
  getUserInfo,
  addStatement,
  sendNotification,
  updateBalance,
} = require("../shared.logics");

exports.personalToMerchant = async (req, res) => {
  const { merchantPayInfo } = req?.body;
  const senderEmail = merchantPayInfo?.from;
  const receiversEmail = merchantPayInfo?.to;
  const amount = parseInt(merchantPayInfo?.amount);

  if (senderEmail === receiversEmail) {
    res.send({
      error: "You have entered your email as merchant email.",
    });
    return;
  }

  const receiversInfo = await getUserInfo(receiversEmail);
  if (!receiversInfo) {
    res.send({
      error: "Receiver not found.",
    });
    return;
  } else if (receiversInfo.type !== "merchant") {
    res.send({
      error: "Reciever is not a Merchant user",
    });
    return;
  }
  const updateSendersUserBalance = await updateBalance(senderEmail, -amount);
  if (updateSendersUserBalance.message === "insufficient") {
    res.send({
      error: "Insufficient balance.",
    });
    return;
  }
  // Statement for merchant
  const sendersStateMent = {
    ...merchantPayInfo,
    userName: receiversInfo?.name,
    userEmail: receiversEmail,
  };
  const senderStatementResult = await addStatement(sendersStateMent);
  const updateReceiversBalanceResult = await updateBalance(
    receiversEmail,
    amount
  );
  const receiversStatement = {
    ...merchantPayInfo,
    name: receiversInfo?.name,
    type: "Receive Money",
    userName: merchantPayInfo?.name,
    userEmail: senderEmail,
    email: receiversEmail,
  };
  const receiversStatementResult = await addStatement(receiversStatement);

  const senderNotificationMessage = `$${amount} has been successfully sent to ${receiversEmail}`;
  const recieverNotificationMessage = `You have received $${amount}, from ${senderEmail}.`;
  const senderNotification = await sendNotification(
    senderEmail,
    senderNotificationMessage
  );
  const sendRecieverNotificationResult = await sendNotification(
    receiversEmail,
    recieverNotificationMessage
  );

  // if (
  senderStatementResult?.insertedId &&
    updateReceiversBalanceResult?.message === "success" &&
    receiversStatementResult?.insertedId &&
    sendRecieverNotificationResult.insertedId &&
    senderNotification.insertedId;
  // ) {

  res.send({ success: `$${amount} sended success fully.` });
  // }
};
