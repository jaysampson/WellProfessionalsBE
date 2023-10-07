const express = require("express");
const Course = require("../../models/courseModel");
const OrderModel = require("../../models/orderModel");
const NotificationModel = require("../../models/notificationModel");
const User = require("../../models/userModel");
const asynchandler = require("express-async-handler");
require("dotenv").config();
const Stripe = require("stripe");
const stripe = Stripe(process.env.STRIPE_SECERT_KEY);

const webCreateCheckout = asynchandler(async (req, res) => {
  const line_item = req.body.item.map((item) => {
    // console.log(item)
    return {
      price_data: {
        currency: "usd",
        product_data: {
          name: item.name,
          images: [item.image],
        },
        unit_amount: item.price * 100,
      },
      quantity: item.qty,
    };
  });

  const session = await stripe.checkout.sessions.create({
    line_item,
    // line_items: [
    //   {
    //     price_data: {
    //       currency: "usd",
    //       product_data: {
    //         name: "T-shirt",
    //       },
    //       unit_amount: 2000,
    //     },
    //     quantity: 1,
    //   },
    //   {
    //     price_data: {
    //       currency: "usd",
    //       product_data: {
    //         name: "Shoe",
    //       },
    //       unit_amount: 5000,
    //     },
    //     quantity: 1,
    //   },
    // ],
    mode: "payment",
    success_url: "http://localhost:8080/api/checkout-success",
    cancel_url: "http://localhost:8080/api/card",
  });

  res.send({ url: session.url });
});

const creatMobilePaymentsIntent = asynchandler(async (req, res) => {

  const customer = await stripe.customers.create({
    metadata: {
      userId: req.body.userId,
      cart: JSON.stringify(req.body.cart),
    },
  });
  console.log(customer, "customer");

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: req.body.amount,
      currency: "usd",
      customer: customer.id,
      automatic_payment_methods: {
        enabled: true,
      },
    });
    res.status(200).json({
      paymentIntent: paymentIntent.client_secret,
      customer: customer.id,
      cart: customer.cart
      
    });
  } catch (error) {
    console.log(error, "error");
    throw new BadRequestError(error);
  }
});

// stripe webhook

// This is your Stripe CLI webhook secret for testing your endpoint locally.
let endpointSecret;
// endpointSecret =
//   "whsec_ca7a2e250f7f258fa42e7d0d25816446de00632f5f7eaa049dd2d6bf24247f21";

const stripeWebHook = asynchandler(async (req, res) => {
  const sig = req.headers["stripe-signature"];

  let data;
  let eventType;

  if (endpointSecret) {
    let event;

    try {
      event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
      console.log("Webhook Verified");
    } catch (err) {
      console.log(`Webhook Error: ${err.message}`);
      res.status(400).send(`Webhook Error: ${err.message}`);
      return;
    }
    data = event.data.object;
    eventType = event.type;
  } else {
    data = req.body.data.object;
    eventType = req.body.type;
  }
  if (eventType === "payment_intent.succeeded") {
    stripe.customers
      .retrieve(data.customer)
      .then((customer) => {
        console.log(customer);
        console.log("data", data);
      })
      .catch((err) => console.log(err.message));
  }
  // if (eventType === "checkout.session.completed") {
  //   stripe.customers
  //     .retrieve(data.customer)
  //     .then((customer) => {
  //       console.log(customer);
  //       console.log("data", data);
  //     })
  //     .catch((err) => console.log(err.message));
  // }

  // Return a 200 response to acknowledge receipt of the event
  res.send().end();
});

module.exports = {
  webCreateCheckout,
  creatMobilePaymentsIntent,
  stripeWebHook,
};
