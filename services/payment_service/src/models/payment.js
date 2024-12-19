const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
    bookingId: String,
    amount: Number,
    userEmail: String,
    transactionId: String,
    status: {
      type: String,
      enum: ['pending', 'completed', 'refunded'],
      default: 'pending'
    }
  }, { timestamps: true });
  
  const Payment = mongoose.model('Payment', paymentSchema);
  module.exports = Payment