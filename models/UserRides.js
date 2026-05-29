const mongoose = require('mongoose');

const rideSchema = new mongoose.Schema({
  username: String,
  uniqueCode: String,
  source: String,
  destination: String,
  date: String,
  time: String,
  seats: Number,
  price: Number,
  rideCode: String
});

const Ride = mongoose.model('Ride', rideSchema);

module.exports = Ride;
