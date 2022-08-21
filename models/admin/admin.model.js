const client = require("..");
const admin = client.db("shohoj-pay").collection("admin");
module.exports = admin;
