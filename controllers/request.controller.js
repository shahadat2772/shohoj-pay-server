const requestCollection = require("../models/moneyRequests.model");

exports.getRequests = async (req, res) => {
  //   const email = req.headers?.email;
  //   const type = req.headers?.type;
  //   const requests = requestCollection.find({ to: email });
  const request = await requestCollection.find().toArray();
  res.send(request);
};
