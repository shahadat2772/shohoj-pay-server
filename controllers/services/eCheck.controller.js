const {
  getUserInfo,
  updateBalance,
  sendNotification,
  addStatement,
} = require("../shared.logics");

// E-Check Money
exports.eCheckInfo = async (req, res) => {
  const { eCheckInfo } = req?.body;
  const from = eCheckInfo?.from;
  const to = eCheckInfo?.to;
  const issuerInfo = await getUserInfo(to);
  if (!issuerInfo) {
    res.send({
      error: "Issuer not found.",
    });
    return;
  }
  const amount = parseInt(eCheckInfo?.amount);
  const updateSendersBalanceResult = await updateBalance(from, -amount);
  if (updateSendersBalanceResult.message === "insufficient") {
    res.send({
      error: "Insufficient balance.",
    });
    return;
  }
  const eCheckStatement = await addStatement(eCheckInfo);
  const notificationMessage = `Congratulation You have been issued with E-Check amount $${amount}, from ${from}.`;
  const sendNotificationResult = await sendNotification(
    to,
    notificationMessage
  );
  if (eCheckStatement?.insertedId && sendNotificationResult.insertedId) {
    res.send({ success: `$${amount} sended success fully.` });
  }
};
