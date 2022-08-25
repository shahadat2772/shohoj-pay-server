const jwt = require("jsonwebtoken");
const { getUserInfo } = require("./shared.logics");

// VERIFY USER ON JOTtOKEN
exports.verifyJWT = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).send({ message: "UnAuthorize Access" });
  }
  const token = authHeader.split(" ")[1];
  jwt.verify(
    token,
    process.env.JWT_SECRET_TOKEN,
    async function (err, decoded) {
      if (err) {
        return res.status(403).send({ message: "Forbidden Access" });
      }
      const userInfo = await getUserInfo(decoded);
      if (!userInfo?.status === "active") {
        return res.status(403).send({
          error: "Your account was deactivated, contact us to know more.",
        });
      }
      req.decoded = decoded;
    }
  );

  next();
};

exports.getJwtToken = async (req, res) => {
  const email = req.params.email;
  const userInfo = await getUserInfo(email);
  if (!userInfo?.status === "active") {
    res.status(403).send({
      error: "Your account was deactivated, contact us to know more.",
    });
    return;
  }
  const token = jwt.sign({ email: email }, process.env.JWT_SECRET_TOKEN, {
    expiresIn: "24h",
  });
  res.send({ token });
};
