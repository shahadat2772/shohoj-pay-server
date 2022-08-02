const client = require("..");
const balanceCollection = client.db("shohoj-pay").collection("balance");
module.exports = balanceCollection;
