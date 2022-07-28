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

// Routes for services
const servicesRoutes = require("./routes/services.route");
const userRouter = require("./routes/services.route");

async function run() {
  // User management routes
  app.use(userRouter);
  // Services routes
  app.use(servicesRoutes);

  try {
    await client.connect();
  } finally {
    // await client.close();
  }
}

run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello there!");
});

app.listen(port, () => {
  console.log("Responding to", port);
});
