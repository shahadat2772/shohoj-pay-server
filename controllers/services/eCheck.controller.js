const {
  getUserInfo,
  updateBalance,
  sendNotification,
  addStatement,
} = require("../shared.logics");
const { v4: uuidv4 } = require("uuid");

// E-Check Money
exports.eCheckInfo = async (req, res) => {
  const { eCheckInfo } = req?.body;
  const from = eCheckInfo?.from;
  const to = eCheckInfo?.to;
  const senderImage = eCheckInfo?.image;
  const receiverInfo = await getUserInfo(to);
  const receiverImage = receiverInfo?.avatar;
  if (!receiverInfo) {
    res.send({
      error: "Receiver not found.",
    });
    return;
  }
  const amount = parseInt(eCheckInfo?.amount);
  const fee = Number((amount * 0.02).toFixed(2));
  const updateSendersBalanceResult = await updateBalance(from, -amount, fee);
  if (updateSendersBalanceResult.message === "insufficient") {
    res.send({
      error: "Insufficient balance.",
    });
    return;
  }

  let transImage;
  let notificationImage;
  let notificationMessage;
  if (from === to) {
    transImage = "https://corduromerchantservices.com/images/Check.png";
    notificationImage = "https://corduromerchantservices.com/images/Check.png";
    notificationMessage = `You have issued an ECheck with amount of $${amount} to ${to}. Check your email to know more.`;
  } else {
    transImage = receiverImage;
    notificationImage = senderImage;
    notificationMessage = `You have received an ECheck with amount of $${amount} from ${from}. Check your email to know more.`;
  }

  const eCheckStateMent = {
    ...eCheckInfo,
    serialNumber: uuidv4(),
    name: receiverInfo?.name,
    image: transImage,
    fee: fee.toString(),
  };
  const eCheckStatement = await addStatement(eCheckStateMent);

  const sendNotificationResult = await sendNotification(
    to,
    notificationMessage,
    notificationImage
  );

  if (eCheckStatement?.insertedId && sendNotificationResult.insertedId) {
    res.send({ success: `$${amount} issued success fully.` });
  }
};
