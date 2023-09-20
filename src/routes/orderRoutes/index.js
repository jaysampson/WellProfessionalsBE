const express = require("express");
const { authMiddleware } = require("../../middlewares/authMiddlewares");
const { createOrder } = require("../../controllers/courseController/orderCont");
const orderRouter = express.Router();


orderRouter.post("/create-order", authMiddleware, createOrder);




module.exports = orderRouter;