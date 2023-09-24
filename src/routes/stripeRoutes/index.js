
const express = require("express");
const { webCreateCheckout } = require("../../controllers/stripeController/webStripe");
const { authMiddleware } = require("../../middlewares/authMiddlewares");
const { creatMobilePaymentsIntent } = require("../../controllers/stripeController");

const stripeRouter = express.Router();


stripeRouter.post("/create-checkout-session", authMiddleware, webCreateCheckout)
stripeRouter.post("/intent", authMiddleware, creatMobilePaymentsIntent);

module.exports = {stripeRouter}