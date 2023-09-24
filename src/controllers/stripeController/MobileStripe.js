const dotenv = require("dotenv");
dotenv.config();
const { BadRequestError } = require("../../errors");
const Stripe = require("stripe");
const Course = require("../../models/courseModel");
const OrderModel = require("../../models/orderModel");
const NotificationModel = require("../../models/notificationModel");
const User = require("../../models/userModel");
const asynchandler = require("express-async-handler");
const sendMail = require("../emailController");

dotenv.config();
const stripe = Stripe(process.env.STRIPE_KEY);



const creatPaymentsIntent = asynchandler(async(req, res)=>{
    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount: req.body.amount,
            currency: "usd",
            automatic_payment_methods:{
                enabled: true
            },
        })
            res.status(200).json({ paymentIntent: paymentIntent.client_secret });

    } catch (error) {
        throw new BadRequestError(error);
        
    }
})

module.exports = { creatPaymentsIntent };