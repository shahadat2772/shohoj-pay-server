const userCollection = require("../models/users.model");

exports.saveUserInfo = async (req, res) => {
  const { userInfo } = req.body;
  const result = await userCollection.insertOne(userInfo);
  res.send(result);
};
