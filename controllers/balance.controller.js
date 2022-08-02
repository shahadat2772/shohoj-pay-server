const balanceCollection = require("../models/balances.model");

exports.getUserBalance = async (req, res) => {
  const email = req.params.email;
  const filter = { email: email };
  const userBalance = await balanceCollection.findOne(filter);
  res.send(userBalance);
};
