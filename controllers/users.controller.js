const userCollection = require("../models/users.model");

exports.saveUserInfo = (req, res) => {
  const { userInfo } = req.body;
  console.log(userInfo);
};
