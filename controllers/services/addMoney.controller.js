const { updateBalance, addStatement } = require("../shared.logics");

// ADD MONEY
exports.addMoney = async (req, res) => {
  const { addMoneyInfo } = req.body;
  const email = addMoneyInfo?.email;
  const amount = parseInt(addMoneyInfo?.amount);
  const updateBalanceResult = await updateBalance(email, amount);
  if (updateBalanceResult.message !== "success") {
    res.send({
      error: "Something went wrong.",
    });
    return;
  }

  // console.log("Add Money statement", addMoneyInfo);
  const addMoneyStatementResult = await addStatement({
    ...addMoneyInfo,
    fee: "0",
  });
  if (
    updateBalanceResult.message === "success" &&
    addMoneyStatementResult.insertedId
  ) {
    res.send({
      success: `$${amount} added successfully`,
    });
  } else {
    res.send({
      error: "Doh! Something terrible happened.",
    });
  }
};
