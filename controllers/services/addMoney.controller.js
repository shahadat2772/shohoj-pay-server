const { updateBalance, addStatement } = require("../shared.logics");
const date = new Date().toLocaleDateString();
const time = new Date().toLocaleTimeString();

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
  const addMoneyStatement = {
    ...addMoneyInfo,
    name: "Add Money",
    date,
    time,
  };
  const addMoneyStatementResult = await addStatement(addMoneyStatement);
  if (
    addMoneyStatementResult.insertedId &&
    updateBalanceResult.message === "success"
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
