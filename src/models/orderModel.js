const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    courseId: {
      type: String,
      required: true,
    },
    payment_info: {
      type: Object,
      //   required: true,
    },
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("Order", OrderSchema);
