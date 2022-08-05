const savingCollection = require("../models/savings.model");

exports.getSavingsBalance = async (req, res) => {
  //   const email = req.params.email;
  //   const filter = { email: email };
  //   const userSavingsInfo = await savingCollection.findOne(filter);
  const userSavingsInfo = await savingCollection.find().toArray();
  res.send(userSavingsInfo);
};
