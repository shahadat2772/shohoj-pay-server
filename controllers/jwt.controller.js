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
      req.decoded = decoded;

      // const userInfo = await getUserInfo(decoded);
      console.log("userInfo");

      next();
    }
  );
};

exports.getJwtToken = async (req, res) => {
  const email = req.params.email;
  const token = jwt.sign({ email: email }, process.env.JWT_SECRET_TOKEN, {
    expiresIn: "24h",
  });
  res.send({ token });
};
