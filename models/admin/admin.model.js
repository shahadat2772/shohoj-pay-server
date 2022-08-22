const client = require("../..");

const shohojPay = client.db("shohoj-pay").collection("shohojPay");

module.exports = shohojPay;
