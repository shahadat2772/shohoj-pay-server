const {
  getUserInfo,
  addStatement,
  sendNotification,
  updateBalance,
} = require("../shared.logics");

exports.personalToMerchant = async (req, res) => {
  const { merchantPayInfo } = req?.body;
  const senderEmail = merchantPayInfo?.from;
  const senderImage = merchantPayInfo?.image;
  const receiversEmail = merchantPayInfo?.to;
  const amount = parseInt(merchantPayInfo?.amount);
  const fee = Number((amount * 0.015).toFixed(2));

  if (senderEmail === receiversEmail) {
    res.send({
      error: "You have entered your email as merchant email.",
    });
    return;
  }

  const receiversInfo = await getUserInfo(receiversEmail);
  const receiversImage = receiversInfo?.avatar;
  if (!receiversInfo) {
    res.send({
      error: "Receiver not found.",
    });
    return;
  } else if (receiversInfo.type !== "merchant") {
    res.send({
      error: "Receiver is not a Merchant user",
    });
    return;
  }
  const updateSendersUserBalance = await updateBalance(
    senderEmail,
    -amount,
    fee
  );
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
    image: receiversImage,
    fee: fee.toString(),
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
    fee: "0",
  };
  const receiversStatementResult = await addStatement(receiversStatement);

  const recieverNotificationMessage = `You have received $${amount}, from ${senderEmail}.`;

  const sendRecieverNotificationResult = await sendNotification(
    receiversEmail,
    recieverNotificationMessage,
    senderImage
  );

  // if (
  senderStatementResult?.insertedId &&
    updateReceiversBalanceResult?.message === "success" &&
    receiversStatementResult?.insertedId &&
    sendRecieverNotificationResult.insertedId;
  // ) {

  res.send({ success: `$${amount} sended success fully.` });
  // }
};
