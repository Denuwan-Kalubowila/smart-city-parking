const express = require("express");
const router = express.Router();
const Stripe = require("stripe");
require("dotenv").config();
const controller = require("../controllers/process_controller")

router.post("/create-payment-intent",controller.processPayment);

module.exports = router;
