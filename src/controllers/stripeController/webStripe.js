const express = require("express");
const asynchandler = require("express-async-handler");
require("dotenv").config();
const Stripe = require("stripe")
const stripe = Stripe(process.env.STRIPE_KEY);

const webCreateCheckout = asynchandler(async (req, res) => {

  const line_item = req.body.item.map((item)=>{
    // console.log(item)
    return  {
        price_data: {
          currency: "usd",
          product_data: {
            name: item.name,
            images:[item.image]
          },
          unit_amount: item.price * 100,
        },
        quantity: item.qty,
      }
  })

  const session = await stripe.checkout.sessions.create({
    // line_item,
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: "T-shirt",
          },
          unit_amount: 2000,
        },
        quantity: 1,
      },
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: "Shoe",
          },
          unit_amount: 5000,
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: "http://localhost:4242/success",
    cancel_url: "http://localhost:4242/cancel",
  });

  res.send({url: session.url});
});

module.exports = { webCreateCheckout };
