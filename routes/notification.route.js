const express = require("express");

const {
  getNotification,
  updateNotificationStatus,
} = require("../controllers/notification.controller");
const router = express.Router();

router.get("/getNotification", getNotification);
router.patch("/updateNotificationStatus", updateNotificationStatus);

module.exports = router;
