const mongoose = require('mongoose');
const ParkingSpot = require('./parkingSpots');

const bookingSchema = new mongoose.Schema({
    parkingSpotId: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'ParkingSpot',
        required: true,
        unique: true
    },
    userEmail: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    vehicleNumber: {
        type: String,
        required: true
    },
    startTime: {
        type: Date,
        default: Date.now
    },
    endTime: {
        type: Date,
        required: true
    },
    bookingStatus: {
        type: String,
        enum: ['booked', 'cancelled'],
        default: 'booked'
    },
    totalCost: {
        type: Number,
        required: true
      }
    }, { timestamps: true });

    // bookingSchema.pre('save', async function(next) {
    //     if (!this.parkingSpotId) {
    //         return next(new Error('Parking spot is not initialized.'));
    //     }
    
    //     const existingBooking = await this.constructor.find({
    //         parkingSpotId: this.parkingSpotId,
    //         bookingStatus: { $ne: 'cancelled' },
    //         $or: [
    //             { startTime: { $lt: this.endTime, $gte: this.startTime } },  // Overlap at start
    //             { endTime: { $gt: this.startTime, $lte: this.endTime } },    // Overlap at end
    //             { startTime: { $lte: this.startTime }, endTime: { $gte: this.endTime } } // Fully encompasses
    //         ]
    //     }).lean();
    
    //     if (existingBooking.length > 0) {
    //         return next(new Error('Booking conflict.'));
    //     }
    
    //     next();
    // });

const Booking = mongoose.model('Booking', bookingSchema);
module.exports = Booking;

