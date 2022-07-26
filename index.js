const express = require("express");
const port = process.env.PORT || 5000;
const app = express();
const cors = require("cors");
require("dotenv").config();
const stripe = require("stripe")(process.env.STRIPE_KEY);

// MiddleWere
app.use(express.json());
app.use(cors());

// Mongodb
const { MongoClient, ServerApiVersion } = require("mongodb");
// URI
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.0lpuf.mongodb.net/?retryWrites=true&w=majority`;
// Client info
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

const servicesRoutes = require("./routes/services.route");

async function run() {
  // Collections

  app.use(servicesRoutes);

  try {
    await client.connect();
  } finally {
    // await client.close();
  }
}

run().catch(console.dir);

// Initial API
app.get("/", (req, res) => {
  res.send("Hello there!");
});

// Listening port
app.listen(port, () => {
  console.log("Responding to", port);
});
