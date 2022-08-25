const transactionCollection = require("../../models/transactions.model");

exports.getServices = async (req, res) => {
  const email = req.headers?.email;
  const date = req.headers?.monthservicefilter;

  const query = {
    email: email,
    date: date,
  };
  const services = await transactionCollection.find(query).toArray();
  res.send(services);
};
exports.getAllService = async (req, res) => {
  const date = req.headers?.monthservicefilter;

  const query = {
    date: date,
  };
  const services = await transactionCollection.find(query).toArray();
  res.send(services);
};
