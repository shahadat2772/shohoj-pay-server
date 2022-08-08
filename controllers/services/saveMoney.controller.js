const {
  updateBalance,
  updateSaving,
  addStatement,
} = require("../shared.logics");

const date = new Date().toLocaleDateString();
const time = new Date().toLocaleTimeString();

// Save Money
exports.saveMoney = async (req, res) => {
  const { saveMoneyInfo } = req.body;
  const email = saveMoneyInfo.email;
  const amount = parseInt(saveMoneyInfo?.amount);
  const updateBalanceResult = await updateBalance(email, -amount);
  if (updateBalanceResult.message === "insufficient") {
    res.send({
      error: "insufficient Balance.",
    });
    return;
  }
  const updateSavingResult = await updateSaving(email, amount);
  console.log("Save Money Statement", saveMoneyInfo);
  const savingStatementResult = await addStatement(saveMoneyInfo);
  if (
    updateBalanceResult.message == "success" &&
    updateSavingResult.modifiedCount > 0 &&
    savingStatementResult.insertedId
  ) {
    res.send({
      success: `$${amount} saved successfully`,
    });
  } else {
    res.send({
      error: "Doh, something terrible happened.",
    });
  }
};
