const shohojPay = require("../../models/admin/admin.model");
const transactionCollection = require("../../models/transactions.model");
const userCollection = require("../../models/users.model");
const { getUserInfo } = require("../shared.logics");

exports.verifyAdmin = async (req, res, next) => {
  const email = req.decoded.email;
  const filter = { email: email };
  const userInfo = await userCollection.findOne(filter);
  if (userInfo.type !== "admin") {
    return res
      .status(401)
      .send({ message: "UnAuthorize Access. This user is not admin" });
  }
  next();
};

exports.manageAdmin = async (req, res) => {
  const email = req.headers.email;
  const action = req.headers.action;
  const filter = { email: email };
  const doc = {
    $set: {
      type: `${action === "add" ? "admin" : "personal"}`,
    },
  };
  const user = await getUserInfo(email);
  const type = user?.type;
  if (!user) {
    res.send({
      error: "User dose not exists.",
    });
    return;
  }
  if (type === "admin" && action === "add") {
    res.send({
      error: "Already admin.",
    });
    return;
  }
  const manageAdminResult = await userCollection.updateOne(filter, doc);
  if (manageAdminResult.matchedCount > 0) {
    res.send({
      success: `Successfully ${action === "add" ? "added" : "removed"} admin.`,
    });
  }
};

exports.getAllAdmin = async (req, res) => {
  const admins = await userCollection.find({ type: "admin" }).toArray();
  res.send(admins);
};

exports.getAllUser = async (req, res) => {
  const users = await userCollection.find({}).toArray();
  res.send(users);
};

exports.getShohojPayInfo = async (req, res) => {
  const shoshoPayInfoResult = await shohojPay.findOne({ id: "shohojPay" });
  res.send(shoshoPayInfoResult);
};

exports.updateAccountStatus = async (req, res) => {
  const email = req.headers.email;
  const action = req.headers.action;
  const doc = {
    $set: {
      status: action,
    },
  };
  const statusUpdateResult = await userCollection.updateOne({ email }, doc);
  if (statusUpdateResult.matchedCount > 0) {
    res.send({
      success: `Account successfully ${action}`,
    });
  } else {
    res.send({
      error: "Something went wrong.",
    });
  }
};

// Getting transaction report
exports.getTransactionReport = async (req, res) => {
  const month = req?.headers?.month;

  // Calculating available months
  const allTransaction = await transactionCollection.find({}).toArray();
  let availableMonths = [];
  allTransaction.forEach((element) => {
    if (availableMonths.indexOf(element.date) == -1) {
      availableMonths.push(element.date);
    }
  });

  const transactions = await transactionCollection
    .find(month === "all" ? {} : { date: month })
    .toArray();

  // Calculating sum
  const getSum = (array) => {
    return array.reduce(
      (previousValue, currentValue) =>
        Number(previousValue) + Number(currentValue?.amount),
      0
    );
  };

  // Calculating sum of fees
  const sumFee = (array) => {
    return array.reduce(
      (previousValue, currentValue) =>
        Number(previousValue) + Number(currentValue?.fee),
      0
    );
  };

  const addMoney = transactions.filter((trans) => trans.type === "Add Money");
  const sendMoney = transactions.filter((trans) => trans.type === "Send Money");
  const receiveMoney = transactions.filter(
    (trans) => trans.type === "Receive Money"
  );
  const saveMoney = transactions.filter((trans) => trans.type === "Save Money");
  const requestMoney = transactions.filter(
    (trans) => trans.type === "Request Money"
  );
  const merchantPay = transactions.filter(
    (trans) => trans.type === "Merchant Pay"
  );
  const eCheck = transactions.filter((trans) => trans.type === "E-Check");
  const MtoM = transactions.filter((trans) => trans.type === "M to M");
  const MtoP = transactions.filter((trans) => trans.type === "M to P");
  const transferSavings = transactions.filter(
    (trans) => trans.type === "Transfer Savings"
  );

  const totalAddMoney = getSum(addMoney);
  const totalSendMoney = getSum(sendMoney);
  const totalReceiveMoney = getSum(receiveMoney);
  const totalSaveMoney = getSum(saveMoney);
  const totalRequestMoney = getSum(requestMoney);
  const totalMerchantPay = getSum(merchantPay);
  const totalECheck = getSum(eCheck);
  const totalMtoM = getSum(MtoM);
  const totalMtoP = getSum(MtoP);
  const totalTransferSavings = getSum(transferSavings);

  const totalTransactionAmount = getSum(transactions);

  const totalAddMoneyFees = sumFee(addMoney);
  const totalSendMoneyFees = sumFee(sendMoney);
  const totalReceiveMoneyFees = sumFee(receiveMoney);
  const totalSaveMoneyFees = sumFee(saveMoney);
  const totalRequestMoneyFees = sumFee(requestMoney);
  const totalMerchantPayFees = sumFee(merchantPay);
  const totalECheckFees = sumFee(eCheck);
  const totalMtoMFees = sumFee(MtoM);
  const totalMtoPFees = sumFee(MtoP);
  const totalTransferSavingsFees = sumFee(transferSavings);

  const totalFees =
    totalAddMoneyFees +
    totalSendMoneyFees +
    totalReceiveMoneyFees +
    totalSaveMoneyFees +
    totalRequestMoneyFees +
    totalMerchantPayFees +
    totalECheckFees +
    totalMtoMFees +
    totalMtoPFees +
    totalTransferSavingsFees;

  const data = {
    totalAddMoney,
    addMoneyTransactionCount: addMoney.length,
    totalAddMoneyFees,
    totalSendMoney,
    sendMoneyTransactionCount: sendMoney.length,
    totalSendMoneyFees,
    totalReceiveMoney,
    receiveMoneyTransactionCount: receiveMoney.length,
    totalReceiveMoneyFees,
    totalSaveMoney,
    saveMoneyTransactionCount: saveMoney.length,
    totalSaveMoneyFees,
    totalRequestMoney,
    requestMoneyTransactionCount: requestMoney.length,
    totalRequestMoneyFees,
    totalMerchantPay,
    merchantPayTransactionCount: merchantPay.length,
    totalMerchantPayFees,
    totalECheck,
    eCheckTransactionCount: eCheck.length,
    totalECheckFees,
    totalMtoM,
    mtoMTransactionCount: MtoM.length,
    totalMtoMFees,
    totalMtoP,
    mtoPTransactionCount: MtoP.length,
    totalMtoPFees,
    totalTransferSavings,
    transferSavingsTransactionCount: transferSavings.length,
    totalTransferSavingsFees,
    totalTransactionAmount,
    totalFees,
    availableMonths,
  };

  res.send(data);
};
