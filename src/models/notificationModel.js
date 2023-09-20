const mongoose = require("mongoose");

const NotificationSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      default:"unread"
    },
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("Notifications", NotificationSchema);
