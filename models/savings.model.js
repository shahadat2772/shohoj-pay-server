const client = require("..");
const savingCollection = client.db("shohoj-pay").collection("savings");
module.exports = savingCollection;
