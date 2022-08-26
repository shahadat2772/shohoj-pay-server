const client = require("..");
const loanCollection = client.db("shohoj-pay").collection("loans");
module.exports = loanCollection;