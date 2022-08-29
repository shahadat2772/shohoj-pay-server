const {
  getUserInfo,
  updateBalance,
  sendNotification,
  addStatement,
} = require("../shared.logics");
const { v4: uuidv4 } = require("uuid");

// E-Check Money
exports.eCheckInfo = async (req, res) => {
  const { eCheckInfo } = req?.body;
  const from = eCheckInfo?.from;
  const to = eCheckInfo?.to;
  const issuerInfo = await getUserInfo(to);
  const issuerImage = issuerInfo?.avatar;
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
  const eCheckStateMent = {
    ...eCheckInfo,
    serialNumber: uuidv4(),
    image: issuerImage,
    fee: "0",
  };
  const eCheckStatement = await addStatement(eCheckStateMent);
  let notificationMessage = `Congratulation You have been issued with E-Check amount $${amount}, from ${from}.`;
  if (to === from) {
    notificationMessage = `Congratulation You have been issued with E-Check amount $${amount}, from yourself.`;
  }
  const sendNotificationResult = await sendNotification(
    to,
    notificationMessage
  );
  if (eCheckStatement?.insertedId && sendNotificationResult.insertedId) {
    res.send({ success: `$${amount} issued success fully.` });
  }
};
