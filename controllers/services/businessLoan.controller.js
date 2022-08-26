const loanCollection = require("../../models/loan.model");
exports.requestBusinessLoan = async (req, res) => {
    const loanInfo = req.body;
    const requester = loanInfo.requester;
    const existingRequests = await loanCollection.find({ requester: requester }).toArray()
    if (existingRequests.length === 0) {
        const insertResult = await loanCollection.insertOne(loanInfo);
        if (insertResult.insertedId) {
            res.send({ success: "Your request is will be reviewed soon." })
        }
    }
    else {
        res.send({ error: "Sorry, you already have a loan request." })
    }


}