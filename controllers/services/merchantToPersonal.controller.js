const { getUserInfo, addStatement, sendNotification, updateBalance } = require("../shared.logics");

exports.mechantToPersonal = async (req, res) => {
    const { sendMoneyInfo } = req?.body;
    const merchantsEmail = sendMoneyInfo?.from;
    const receiversEmail = sendMoneyInfo?.to;

    if (merchantsEmail === receiversEmail) {
        res.send({
            error: "You have entered your email as receiver's email.",
        });
        return;
    }

    const receiversInfo = await getUserInfo(receiversEmail);
    if (!receiversInfo) {
        res.send({
            error: "Receiver not found.",
        });
        return;
    }
    else if (receiversInfo.type !== "personal") {
        res.send({
            error: "Reciever is not a Personal user"
        });
        return;
    }
    const amount = parseInt(sendMoneyInfo?.amount);
    const updateMerchantsBalanceResult = await updateBalance(merchantsEmail, -amount);
    if (updateMerchantsBalanceResult.message === "insufficient") {
        res.send({
            error: "Insufficient balance.",
        });
        return;
    }
    // Statement for merchant
    const merchantsStatement = {
        ...sendMoneyInfo,
        userName: receiversInfo?.name,
        userEmail: receiversEmail,
    };

    const merchantsStatementResult = await addStatement(merchantsStatement);
    const updateReceiversBalanceResult = await updateBalance(
        receiversEmail,
        amount
    );

    // Statement for receiver
    const receiversStatement = {
        ...sendMoneyInfo,
        name: receiversInfo?.name,
        type: "Receive Money",
        userName: sendMoneyInfo?.name,
        userEmail: merchantsEmail,
        email: receiversEmail,
    };
    const receiversStatementResult = await addStatement(receiversStatement);

    const recieverNotificationMessage = `You have received $${sendMoneyInfo.amount}, from ${merchantsEmail}.`;
    const merchantNotificationMessage = `$${sendMoneyInfo.amount} has been successfully sent to ${receiversEmail}`
    const sendRecieverNotificationResult = await sendNotification(
        receiversEmail,
        recieverNotificationMessage
    );
    const sendMerchantNotificationResult = await sendNotification(
        merchantsEmail,
        merchantNotificationMessage
    );

    if (
        merchantsStatementResult?.insertedId &&
        updateReceiversBalanceResult?.message === "success" &&
        receiversStatementResult?.insertedId &&
        sendRecieverNotificationResult.insertedId &&
        sendMerchantNotificationResult.insertedId
    ) {
        res.send({ success: `$${amount} sended success fully.` });
    }
}