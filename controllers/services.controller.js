const balanceCollection = require("../models/balances.model");
const savingCollection = require("../models/savings.model");
const transactionCollection = require("../models/transactions.model");
const date = new Date().toLocaleDateString();

// ADD MONEY
exports.addMoney = async (req, res) => {
  const { addMoneyInfo } = req.body;
  const email = addMoneyInfo?.email;
  const addMoneyAmount = addMoneyInfo?.amount;
  const filter = { email };
  const usersBalanceInfo = await balanceCollection.findOne(filter);
  const lastBalance = usersBalanceInfo?.balance;
  const newBalance = (
    parseFloat(lastBalance) + parseInt(addMoneyAmount)
  ).toString();
  const doc = {
    $set: {
      balance: newBalance,
    },
  };
  const balanceUpdateResult = await balanceCollection.updateOne(filter, doc);
  if (balanceUpdateResult?.modifiedCount > 0) {
    const stateMentResult = await transactionCollection.insertOne(addMoneyInfo);
    res.send([balanceUpdateResult, stateMentResult]);
  }
};

// Send Money
exports.sendMoney = async (req, res) => {
  const { sendMoneyInfo } = req.body;
  const sender = sendMoneyInfo?.from;
  const receiver = sendMoneyInfo?.to;
  const amount = sendMoneyInfo?.amount;

  // Updating senders balance
  const sendersFilter = { email: sender };
  const sendersBalanceInfo = await balanceCollection.findOne(sendersFilter);
  const sendersLastBalance = sendersBalanceInfo?.balance;
  const sendersNewBalance = (
    parseInt(sendersLastBalance) - parseInt(amount)
  ).toString();
  const sendersUpdatedBalance = {
    $set: {
      balance: sendersNewBalance,
    },
  };
  const sendersBalanceUpdateResult = await balanceCollection.updateOne(
    sendersFilter,
    sendersUpdatedBalance
  );
  const sendersStatementResult = await transactionCollection.insertOne(
    sendMoneyInfo
  );

  if (
    sendersBalanceUpdateResult?.modifiedCount > 0 &&
    sendersStatementResult?.insertedId
  ) {
    // Updating receivers balance
    const receiversFilter = { email: receiver };
    const receiversBalanceInfo = await balanceCollection.findOne(
      receiversFilter
    );
    const receiversLastBalance = receiversBalanceInfo?.balance;
    const receiversNewBalance = (
      parseInt(receiversLastBalance) + parseInt(amount)
    ).toString();
    const receiversUpdatedBalance = {
      $set: {
        balance: receiversNewBalance,
      },
    };
    const receiversBalanceUpdateResult = await balanceCollection.updateOne(
      receiversFilter,
      receiversUpdatedBalance
    );
    const receiversStatement = {
      type: "receiveMoney",
      email: receiver,
      from: sender,
      to: receiver,
      amount: amount,
      date: sendMoneyInfo?.date,
    };
    const receiversStatementResult = await transactionCollection.insertOne(
      receiversStatement
    );

    if (
      receiversBalanceUpdateResult?.modifiedCount > 0 &&
      receiversStatementResult.insertedId
    ) {
      res.send({
        message: "success",
      });
    }
  }
};

// Save Money
exports.saveMoney = async (req, res) => {
  const { saveMoneyInfo } = req.body;
  // console.log(saveMoneyInfo);
  const amount = saveMoneyInfo?.amount;
  const filter = { email: saveMoneyInfo.email };
  // Updating balance info
  const balanceInfo = await balanceCollection.findOne(filter);
  const currentBalance = balanceInfo?.balance;
  const newBalance = (parseInt(currentBalance) - parseInt(amount)).toString();
  const updatedBalance = {
    $set: {
      balance: newBalance,
    },
  };
  const balanceUpdateResult = await balanceCollection.updateOne(
    filter,
    updatedBalance
  );

  if (balanceUpdateResult?.modifiedCount > 0) {
    // Updating saving info
    const savingInfo = await savingCollection.findOne(filter);
    const currentSaving = savingInfo?.saving;
    const newSaving = (parseInt(currentSaving) + parseInt(amount)).toString();
    const updatedSaving = {
      $set: {
        saving: newSaving,
      },
    };

    const SavingUpdateResult = await savingCollection.updateOne(
      filter,
      updatedSaving
    );

    const statementResult = await transactionCollection.insertOne(
      saveMoneyInfo
    );

    if (SavingUpdateResult?.modifiedCount > 0 && statementResult?.insertedId) {
      res.send({ message: "success" });
    }
  }
};
