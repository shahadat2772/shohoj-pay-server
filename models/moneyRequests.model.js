const client = require("..");
const requestsCollection = client.db("shohoj-pay").collection("request");
module.exports = requestsCollection;
