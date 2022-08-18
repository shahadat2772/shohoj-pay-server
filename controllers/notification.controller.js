const notificationCollection = require("../models/notifications.model");

exports.getNotification = async (req, res) => {
  const email = req.headers?.email;
  const filter = { email: email };
  const notifications = await notificationCollection.find(filter).toArray();
  const unSeenNotification = notifications
    .filter((notification) => notification.status === "unseen")
    ?.map((notification) => notification._id);

  res.send([notifications, unSeenNotification]);
};

exports.updateNotificationStatus = async (req, res) => {
  const { unseenNotification } = req.body;
  const filter = { status: "unseen" };
  const updatedDoc = {
    $set: {
      status: "seen",
    },
  };
  const updateResult = await notificationCollection.updateMany(
    filter,
    updatedDoc
  );
  res.send(updateResult);
};
