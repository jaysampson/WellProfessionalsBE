
const express = require("express");
const { webCreateCheckout } = require("../../controllers/stripeController/webStripe");
const { authMiddleware } = require("../../middlewares/authMiddlewares");
const { creatMobilePaymentsIntent, stripeWebHook } = require("../../controllers/stripeController");

const stripeRouter = express.Router();


stripeRouter.post("/create-checkout-session", authMiddleware, webCreateCheckout)
stripeRouter.post("/intent", authMiddleware, creatMobilePaymentsIntent);
// stripeRouter.post(
//   "/webhook",
//   express.raw({ type: "application/json" }),
//   stripeWebHook
// );

module.exports = {stripeRouter}