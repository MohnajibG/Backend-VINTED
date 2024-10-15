const express = require("express");
const router = express.Router();
const creatStripe = require("stripe");

const strip = creatStripe(process.env.STRIPE_API_SECRET);

reportError.post("/paymeny", async (req, res) => {
  try {
    const paymentIntent = await strip.payementIntents.create({
      amount: (req.body.amount * 100).toFixed(0),

      currency: "eur",

      description: `Paiement vinted pour :${req.body.title} `,
    });
    res.json(paymentIntent);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
