const BookingSpot = require('../models/booking');
const ParkingSpot = require('../models/parkingSpots');

const bookingControllers = {
  async createBooking(req, res) {
    try {
      const { spotNumber, userEmail, vehicleNumber, startTime, endTime } = req.body;

      // Validate parking spot availability
      const parkingSpot = await ParkingSpot.findOne({ spotNumber:spotNumber });
      if (!parkingSpot || parkingSpot.status !== 'available') {
        return res.status(404).json({
          success: false,
          message: 'Parking spot not available',
        });
      }

      // Calculate total cost
      const hours = (new Date(endTime) - new Date(startTime)) / (1000 * 60 * 60);
      if (hours <= 0) {
        return res.status(400).json({
          success: false,
          message: 'End time must be after start time',
        });
      }
      const costForHours = hours * 5;
      const totalCost = costForHours + 100;

      // Create a new booking
      const booking = new BookingSpot({
        parkingSpotId: parkingSpot._id,
        userEmail,
        vehicleNumber,
        startTime,
        endTime,
        totalCost,
      });

      await booking.save();

      // Update parking spot status
      parkingSpot.status = 'reserved';
      await parkingSpot.save();

      res.status(201).json({
        success: true,
        data: booking,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  async cancelBooking(req, res) {
    try {
      const booking = await BookingSpot.findById(req.params.id);

      if (!booking) {
        return res.status(404).json({
          success: false,
          message: 'Booking not found',
        });
      }

      // Update booking status
      booking.bookingStatus = 'cancelled';
      await booking.save();

      // Update parking spot status
      const parkingSpot = await ParkingSpot.findById(booking.parkingSpotId);
      if (parkingSpot) {
        parkingSpot.status = 'available';
        await parkingSpot.save();
      }

      res.status(200).json({
        success: true,
        data: booking,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  async getUserBookings(req, res) {
    try {
      const bookings = await BookingSpot.find({
        userEmail: req.params.email,
      }).populate('parkingSpotId');

      res.status(200).json({
        success: true,
        data: bookings,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};

module.exports = bookingControllers;
