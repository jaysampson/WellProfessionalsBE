
const express = require("express");
const { webCreateCheckout } = require("../../controllers/stripeController/webStripe");
const { authMiddleware } = require("../../middlewares/authMiddlewares");

const stripeRouter = express.Router();


stripeRouter.post("/create-checkout-session", authMiddleware, webCreateCheckout)

module.exports = {stripeRouter}