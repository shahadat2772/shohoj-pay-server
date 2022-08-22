const shohojPay = require("../../models/admin/admin.model");
const userCollection = require("../../models/users.model");
const { getUserInfo } = require("../shared.logics");

exports.verifyAdmin = async (req, res, next) => {
  const email = req.decoded.email;
  const filter = { email: email };
  const userInfo = await userCollection.findOne(filter);
  if (userInfo.type !== "admin") {
    return res
      .status(401)
      .send({ message: "UnAuthorize Access. This user is not admin" });
  }
  next();
};

exports.manageAdmin = async (req, res) => {
  const email = req.headers.email;
  const action = req.headers.action;
  const filter = { email: email };
  const doc = {
    $set: {
      type: `${action === "add" ? "admin" : "personal"}`,
    },
  };
  const user = await getUserInfo(email);
  const type = user?.type;
  if (!user) {
    res.send({
      error: "User dose not exists.",
    });
    return;
  }
  if (type === "admin" && action === "add") {
    res.send({
      error: "Already admin.",
    });
    return;
  }
  const manageAdminResult = await userCollection.updateOne(filter, doc);
  if (manageAdminResult.matchedCount > 0) {
    res.send({
      success: `Successfully ${action === "add" ? "added" : "removed"} admin.`,
    });
  }
};

exports.getAllAdmin = async (req, res) => {
  const admins = await userCollection.find({ type: "admin" }).toArray();
  res.send(admins);
};

exports.getAllUser = async (req, res) => {
  const users = await userCollection.find({}).toArray();
  res.send(users);
};

exports.getShohojPayInfo = async (req, res) => {
  const shoshoPayInfoResult = await shohojPay.findOne({ id: "shohojPay" });
  res.send(shoshoPayInfoResult);
};

exports.updateAccountStatus = async (req, res) => {
  const email = req.headers.email;
  const action = req.headers.action;
  console.log(email, action);
};
