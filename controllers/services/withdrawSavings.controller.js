const {
  updateBalance,
  sendNotification,
  addStatement,
  updateSaving,
} = require("../shared.logics");

// E-Check Money
exports.withdrawSavings = async (req, res) => {
  const { withdrawInfo } = req?.body;
  const email = withdrawInfo?.email;
  const amount = parseInt(withdrawInfo?.amount);
  const updateSavingsBalanceResult = await updateSaving(email, -amount);
  if (updateSavingsBalanceResult.message === "insufficient") {
    res.send({
      error: "Insufficient Savings balance.",
    });
    return;
  }
  const updateUserBalance = await updateBalance(email, amount);
  const withdrawStateMent = await addStatement(withdrawInfo);
  const notificationMessage = `You have withdrawn amount $${amount} from your savings.`;
  const sendNotificationResult = await sendNotification(
    email,
    notificationMessage
  );
  if (
    updateUserBalance.message == "success" &&
    withdrawStateMent?.insertedId &&
    sendNotificationResult.insertedId
  ) {
    res.send({ success: `$${amount} sended success fully.` });
  }
};
