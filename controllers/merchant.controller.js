const userCollection = require("../models/users.model");

exports.verifyMerchant = async (req, res, next) => {
  const email = req.headers.email;
  const filter = { email: email };
  const userInfo = await userCollection.findOne(filter);
  if (userInfo.type !== "merchant") {
    return res
      .status(401)
      .send({ message: "UnAuthorize Access. This user is not Merchant" });
  }
  // res.send({ message: "hello merchant saheb!" });
  next()
};
