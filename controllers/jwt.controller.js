const jwt = require("jsonwebtoken");
const jwtUserCollection = require("../models/jwt.modal");

// VERIFY USER ON JOTtOKEN
exports.verifyJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).send({ message: "UnAuthorize Access" });
  }
  const token = authHeader.split(" ")[1];
  jwt.verify(token, process.env.JWT_SECRET_TOKEN, function (err, decoded) {
    if (err) {
      return res.status(403).send({ message: "Forbidden Access" });
    }
    req.decoded = decoded;
    next();
  });
};

exports.jwtUser = async (req, res) => {
  const email = req.params.email;
  const filter = { email: email };
  const user = req.body;
  const options = { upsert: true };
  const updateDoc = {
    $set: user,
  };
  const result = await jwtUserCollection.updateOne(filter, updateDoc, options);
  const token = jwt.sign({ email: email }, process.env.JWT_SECRET_TOKEN, {
    expiresIn: "24h",
  });
  res.send({ result, token });
};
