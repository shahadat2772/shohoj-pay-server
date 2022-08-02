const client = require("..");
const userCollection = client.db("shohoj-pay").collection("users");
module.exports = userCollection;
