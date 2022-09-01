const requestCollection = require("../models/moneyRequests.model");

exports.getRequests = async (req, res) => {
  const email = req.headers?.email;
  const type = req.headers?.type;
  let filter;
  if (type === "incoming") {
    filter = { to: email };
  } else {
    filter = { from: email };
  }
  const requests = requestCollection.find(filter);
  res.send(requests);
};
