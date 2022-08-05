const express = require("express");
const port = process.env.PORT || 5000;
const app = express();
const cors = require("cors");
require("dotenv").config();

// MiddleWere
app.use(express.json());
app.use(cors());

const { MongoClient, ServerApiVersion } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.0lpuf.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

// Exporting client info
module.exports = client;

// IMPORT ROUTES
const servicesRoutes = require("./routes/services.route");
const userRouter = require("./routes/users.route");
const stripeRouter = require("./routes/stripe.route");
const balanceRoute = require("./routes/balance.route");
const userSavingsRoute = require("./routes/savings.route");
const userTransactionRoute = require("./routes/transaction.route");

async function run() {
  // User Balance routes
  app.use(balanceRoute);
  // USER SAVINGS ROUTE
  app.use(userSavingsRoute);
  // USER TRANSACTION STATUS
  app.use(userTransactionRoute);
  // User management routes
  app.use(userRouter);
  // Services routes
  app.use(servicesRoutes);
  // Stripe router
  app.use(stripeRouter);
  try {
    await client.connect();
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello from Shohoj Pay!");
});
app.use((req, res, next) => {
  res.status(404).json({
    message: "Resource Not Found",
  });
});

app.listen(port, () => {
  console.log("Responding to", port);
});
