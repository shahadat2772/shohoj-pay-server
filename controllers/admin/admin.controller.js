const userCollection = require("../../models/users.model");

exports.verifyAdmin = async (req, res, next) => {
  const email = req.headers.email;
  const filter = { email: email };
  const userInfo = await userCollection.findOne(filter);
  if (userInfo.type !== "admin") {
    return res
      .status(401)
      .send({ message: "UnAuthorize Access. This user is not admin" });
  }
  next();
};

exports.makeAdmin = async (req, res) => {
  const email = req.params.email;
  const filter = { email: email };
  const doc = {
    $set: {
      type: "admin",
    },
  };
  const user = await userCollection.findOne(filter);
  if (!user) {
    res.send({
      error: "User not found.",
    });
    return;
  } else if (user.type === "admin") {
    res.send({
      error: "User is already Admin",
    });
    return;
  } else {
    const result = await userCollection.updateOne(filter, doc, {
      upsert: true,
    });
    if (result?.acknowledged && result?.modifiedCount) {
      res.send({ success: `${user.name} is now admin.` });
    }
  }
};
