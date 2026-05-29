const mongoose = require("mongoose");

const rideSchema = new mongoose.Schema(
{
    username: {
        type: String,
        required: true
    },

    uniqueCode: {
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

    seats: {
        type: Number,
        required: true
    },

    price: {
        type: Number,
        required: true
    },

    rideCode: {
        type: String,
        required: true,
        unique: true
    }
},
{
    timestamps: true
});

module.exports = mongoose.model("Ride", rideSchema);
