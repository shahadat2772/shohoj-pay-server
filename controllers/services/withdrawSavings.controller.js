const {
  getUserInfo,
  updateBalance,
  sendNotification,
  addStatement,
  updateSaving,
} = require("../shared.logics");

// E-Check Money
exports.withdrawSavings = async (req, res) => {
  const { withdrawInfo } = req?.body;
  console.log(withdrawInfo);
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
  console.log(email);
  //   const eCheckStatement = await addStatement(eCheckInfo);
  //   const notificationMessage = `Congratulation You have been issued with E-Check amount $${amount}, from ${from}.`;
  //   const sendNotificationResult = await sendNotification(
  //     to,
  //     notificationMessage
  //   );
  if (updateUserBalance.message == "success") {
    res.send({ success: `$${amount} sended success fully.` });
  }
};
