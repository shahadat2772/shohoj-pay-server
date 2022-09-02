const {
  updateBalance,
  addStatement,
  updateSaving,
} = require("../shared.logics");

const withdrawImage = "https://static.thenounproject.com/png/4885469-200.png";
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
  if (updateUserBalance.message == "success" && withdrawStateMent?.insertedId) {
    res.send({ success: `$${amount} Withdraw success fully.` });
  }
};
