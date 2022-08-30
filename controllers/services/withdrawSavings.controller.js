const {
  updateBalance,
  sendNotification,
  addStatement,
  updateSaving,
} = require("../shared.logics");

const withdrawImage =
  "https://www.pavilionweb.com/wp-content/uploads/2017/03/man-300x300.png";
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
  const withdrawStateMentInfo = {
    ...withdrawInfo,
    image: withdrawImage,
    fee: "0",
  };
  const withdrawStateMent = await addStatement(withdrawStateMentInfo);
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
    res.send({ success: `$${amount} Withdraw success fully.` });
  }
};
