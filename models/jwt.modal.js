const client = require("..");
const jwtUserCollection = client.db("shohoj-pay").collection("jwtUser");
module.exports = jwtUserCollection;
