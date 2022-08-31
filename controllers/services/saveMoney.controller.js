const {
  updateBalance,
  updateSaving,
  addStatement,
} = require("../shared.logics");

const saveMoneyImage =
  "https://www.svgrepo.com/show/108565/tool-for-saving-money.svg";

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
  console.log("Save money statement", saveMoneyInfo);
  const saveMoneyStateMent = {
    ...saveMoneyInfo,
    image: saveMoneyImage,
    fee: "0",
  };
  const savingStatementResult = await addStatement(saveMoneyStateMent);
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
