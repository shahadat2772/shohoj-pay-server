const client = require("..");
const notificationCollection = client
  .db("shohoj-pay")
  .collection("notification");
module.exports = notificationCollection;
