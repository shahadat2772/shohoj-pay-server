const client = require("..");
const transactionCollection = client
  .db("shohoj-pay")
  .collection("transactions");
module.exports = transactionCollection;
