const client = require("..");

// USER COLLECTION
const userCollection = client.db("shohoj-pay").collection("users");

// Exporting the user collection
module.exports = userCollection;
