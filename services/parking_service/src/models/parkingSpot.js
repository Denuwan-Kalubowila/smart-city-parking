// src/models/ParkingSpot.js
const mongoose = require('mongoose');

const parkingSpotSchema = new mongoose.Schema({
  spotNumber: {
    type: String,
    required: true,
    unique: true
  },
  isOccupied: {
    type: Boolean,
    default: false
  },
  level: {
    type: Number,
    required: true
  },
  type: {
    type: String,
    enum: ['standard', 'electric'],
    default: 'standard'
  },
  status: {
    type: String,
    enum: ['available', 'occupied', 'reserved', 'maintenance'],
    default: 'available'
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

const ParkingSpot = mongoose.model('ParkingSpot', parkingSpotSchema);
module.exports = ParkingSpot;