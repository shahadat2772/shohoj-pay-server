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
const jwtUserRoute = require("./routes/jwtUser.route");
const userRouter = require("./routes/users.route");
const stripeRouter = require("./routes/stripe.route");
const userAllEmailInfo = require("./routes/userAllEmailInfo.route");
const adminRoute = require("./routes/admin/admin.route");
const notificationRoute = require("./routes/notification.route");

async function run() {
  // JWT USER ROUTE
  app.use(jwtUserRoute);
  // GET USER ALL EMAIL INFO
  app.use(userAllEmailInfo);
  // User management routes
  app.use(userRouter);
  // Services routes
  app.use(servicesRoutes);
  // Stripe router
  app.use(stripeRouter);
  // Notification route
  app.use(notificationRoute);
  // Admin Route
  app.use(adminRoute);
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

const server = app.listen(port, () => {
  console.log("Responding to", port);
});

// socket.io
const io = require("socket.io")(server, {
  pingTimeOut: 6000,
  cors: {
    origin: ["https://shohoj-pay-app.web.app", "http://localhost:3000"]
  },
});

io.on("connection", (socket) => {
  socket.on("join_room", (email) => {
    socket.join(email);
  });

  socket.on("send_notification", (data) => {
    socket.to(data?.email).emit("receive_notification", data);
  });
});
