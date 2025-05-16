const mongoose = require("mongoose");

const rideSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    source: { type: String, required: true },
    destination: { type: String, required: true },
    dateTime: { type: Date, required: true },
    seatsAvailable: { type: Number, required: true },
    passengers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
}, { timestamps: true });


module.exports = mongoose.model("Ride", rideSchema);
