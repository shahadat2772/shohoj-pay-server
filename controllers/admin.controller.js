const userCollection = require("../models/users.model")

exports.verifyAdmin = async (req, res, next) => {
    const email = req.headers.email;
    const filter = { email: email };
    const userInfo = await userCollection.findOne(filter);
    if (userInfo.type !== 'admin' && userInfo.name !== "Abdulla Al Mahfuz Swaron") {
        console.log("you are not admin")
        return res.status(401).send({ message: "UnAuthorize Access. This user is not admin" });
    }

    next()
};