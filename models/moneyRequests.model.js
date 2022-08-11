const client = require("..");
const requestCollection = client.db("shohoj-pay").collection("request");
module.exports = requestCollection;
