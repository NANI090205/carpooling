const mongoose = require('mongoose');

const bookedRideSchema = new mongoose.Schema({
  rideId: { type: mongoose.Schema.Types.ObjectId, ref: 'Ride', required: true },
  bookedBy: String,
  bookedByCode: String,
  publishedBy: String,
  source: String,
  destination: String,
  date: String,
  time: String,
  price: Number,
  seatsBooked: Number,
  totalPrice: Number
});

module.exports = mongoose.model('BookedRide', bookedRideSchema);
