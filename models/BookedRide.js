const mongoose = require("mongoose");

const bookedRideSchema = new mongoose.Schema(
{
    rideId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Ride",
        required: true
    },

    bookedBy: {
        type: String,
        required: true
    },

    bookedByCode: {
        type: String,
        required: true
    },

    publishedBy: {
        type: String,
        required: true
    },

    source: {
        type: String,
        required: true
    },

    destination: {
        type: String,
        required: true
    },

    date: {
        type: String,
        required: true
    },

    time: {
        type: String,
        required: true
    },

    price: {
        type: Number,
        required: true
    },

    seatsBooked: {
        type: Number,
        required: true,
        min: 1
    },

    totalPrice: {
        type: Number,
        required: true
    }
},
{
    timestamps: true
});

module.exports = mongoose.model(
    "BookedRide",
    bookedRideSchema
);
