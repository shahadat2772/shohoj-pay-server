const {
  updateBalance,
  addStatement,
  sendNotification,
} = require("../shared.logics");

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
  // NOTIFICATION
  let notificationMessage = ` $${amount} has been added to you account`;
  const sendNotificationResult = await sendNotification(
    email,
    notificationMessage
  );
  // console.log("Add Money statement", addMoneyInfo);
  const addMoneyStatementResult = await addStatement(addMoneyInfo);
  if (
    updateBalanceResult.message === "success" &&
    addMoneyStatementResult.insertedId &&
    sendNotificationResult.insertedId
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
