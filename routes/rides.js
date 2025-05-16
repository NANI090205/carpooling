const express = require('express');
const router = express.Router();
const Ride = require('../models/UserRides');
const BookedRide = require('../models/BookedRide');
const User = require('../models/User');
const sendMail = require('../utils/mailer');

//Utility: Generate unique ride code
const generateRideCode = () => {
  return 'RIDE-' + Math.random().toString(36).substring(2, 8).toUpperCase();
};

//POST: Publish a Ride
router.post('/publish', async (req, res) => {
  try {
    const { username, uniqueCode, source, destination, date, time, seats, price } = req.body;

    if (!username || !uniqueCode || !source || !destination || !date || !time || !seats || !price) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const rideCode = generateRideCode();
    const newRide = new Ride({ username, uniqueCode, source, destination, date, time, seats, price, rideCode });

    await newRide.save();
    res.status(201).json({ message: 'Ride published successfully', rideCode });
  } catch (err) {
    console.error('❌ Publish ride error:', err);
    res.status(500).json({ message: 'Error while publishing ride' });
  }
});

// GET: Fetch rides published by a user
router.get('/user/:uniqueCode', async (req, res) => {
  try {
    const rides = await Ride.find({ uniqueCode: req.params.uniqueCode });
    res.status(200).json(rides);
  } catch (err) {
    console.error('❌ Fetch user rides error:', err);
    res.status(500).json({ message: 'Error fetching user rides' });
  }
});

// GET: Fetch booked rides for a user
router.get('/booked/:uniqueCode', async (req, res) => {
  try {
    const bookings = await BookedRide.find({ bookedByCode: req.params.uniqueCode });

    const enriched = await Promise.all(
      bookings.map(async (booking) => {
        const ride = await Ride.findById(booking.rideId);
        return {
          _id: booking._id,
          source: booking.source,
          destination: booking.destination,
          date: booking.date,
          time: booking.time,
          bookedSeats: booking.seatsBooked,
          totalPrice: booking.totalPrice,
          publishedBy: booking.publishedBy,
          rideCode: ride?.rideCode || 'N/A'
        };
      })
    );

    res.status(200).json(enriched);
  } catch (err) {
    console.error('❌ Fetch booked rides error:', err);
    res.status(500).json({ message: 'Error fetching booked rides' });
  }
});

// GET: Fetch all available rides
router.get('/all', async (_req, res) => {
  try {
    const rides = await Ride.find();
    res.status(200).json(rides);
  } catch (err) {
    console.error('❌ Fetch all rides error:', err);
    res.status(500).json({ message: 'Error fetching all rides' });
  }
});

// POST: Book a ride
router.post('/book', async (req, res) => {
  try {
    const { rideId, bookedBy, bookedByCode, publishedBy, seatsBooked, totalPrice } = req.body;

    if (!rideId || !bookedBy || !bookedByCode || !publishedBy || !seatsBooked || !totalPrice) {
      return res.status(400).json({ message: 'All fields are required for booking.' });
    }

    const ride = await Ride.findById(rideId);
    if (!ride) return res.status(404).json({ message: 'Ride not found.' });

    if (ride.seats < seatsBooked) {
      return res.status(400).json({ message: 'Not enough seats available.' });
    }

    ride.seats -= seatsBooked;
    await ride.save();

    const bookedRide = new BookedRide({
      rideId,
      bookedBy,
      bookedByCode,
      publishedBy,
      username: bookedBy,
      uniqueCode: bookedByCode,
      source: ride.source,
      destination: ride.destination,
      date: ride.date,
      time: ride.time,
      price: ride.price,
      seatsBooked,
      totalPrice
    });

    await bookedRide.save();

    // Notify both users
    const publisherUser = await User.findOne({ username: publishedBy });
    const bookerUser = await User.findOne({ username: bookedBy });

    if (publisherUser?.email) {
      await sendMail(
        publisherUser.email,
        '🚗 Your Ride Has Been Booked!',
        `Hello ${publishedBy}, your ride was booked by ${bookedBy}.`,
        `<h2>Hi ${publishedBy},</h2>
         <p>Your ride has been booked:</p>
         <ul>
            <li><strong>From:</strong> ${ride.source}</li>
            <li><strong>To:</strong> ${ride.destination}</li>
            <li><strong>Date:</strong> ${ride.date}</li>
            <li><strong>Time:</strong> ${ride.time}</li>
            <li><strong>Seats Booked:</strong> ${seatsBooked}</li>
            <li><strong>Total Price:</strong> ₹${totalPrice}</li>
         </ul>`
      );
    }

    if (bookerUser?.email) {
      await sendMail(
        bookerUser.email,
        '✅ Booking Confirmed',
        `Hello ${bookedBy}, your ride has been successfully booked.`,
        `<h2>Hi ${bookedBy},</h2>
         <p>Your booking is confirmed:</p>
         <ul>
            <li><strong>From:</strong> ${ride.source}</li>
            <li><strong>To:</strong> ${ride.destination}</li>
            <li><strong>Date:</strong> ${ride.date}</li>
            <li><strong>Time:</strong> ${ride.time}</li>
            <li><strong>Seats:</strong> ${seatsBooked}</li>
            <li><strong>Total Price:</strong> ₹${totalPrice}</li>
         </ul>
         <p>– Carpooling Team</p>`
      );
    }

    res.status(200).json({
      message: 'Ride booked successfully.',
      rideDetails: {
        bookedBy,
        source: ride.source,
        destination: ride.destination,
        date: ride.date,
        time: ride.time,
        seatsBooked,
        totalPrice
      }
    });
  } catch (err) {
    console.error('Booking error:', err);
    res.status(500).json({ message: 'Error while booking ride.' });
  }
});

//DELETE: Cancel a published ride (by Publisher)
router.delete('/cancel/published/:rideId', async (req, res) => {
  try {
    const rideId = req.params.rideId;
    const ride = await Ride.findById(rideId);
    if (!ride) return res.status(404).json({ message: 'Ride not found' });

    const bookings = await BookedRide.find({ rideId });

    for (const booking of bookings) {
      const bookerUser = await User.findOne({ username: booking.bookedBy });
      if (bookerUser?.email) {
        await sendMail(
          bookerUser.email,
          'Ride Cancelled by Publisher',
          `Your ride has been cancelled.`,
          `<h3>Hi ${bookerUser.username},</h3>
           <p>Your booking from <strong>${ride.source}</strong> to <strong>${ride.destination}</strong> on <strong>${ride.date}</strong> has been cancelled by the publisher.</p>
           <p>Sorry for the inconvenience.</p>`
        );
      }
    }

    await BookedRide.deleteMany({ rideId });
    await Ride.findByIdAndDelete(rideId);

    res.status(200).json({ message: 'Ride and related bookings cancelled successfully' });
  } catch (err) {
    console.error('Cancel published ride error:', err);
    res.status(500).json({ message: 'Error cancelling ride' });
  }
});

// ❌ DELETE: Cancel a booked ride (by User)
router.delete('/cancel/booked/:bookingId', async (req, res) => {
  try {
    const bookingId = req.params.bookingId;
    console.log("BookingId received:", bookingId);

    if (!bookingId || bookingId === 'undefined') {
      return res.status(400).json({ message: '! Booking ID is missing or invalid.' });
    }

    const booking = await BookedRide.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: '! Booking not found.' });
    }

    const ride = await Ride.findById(booking.rideId);
    if (ride) {
      ride.seats += booking.seatsBooked;
      await ride.save();
    }

    const publisherUser = await User.findOne({ username: booking.publishedBy });
    if (publisherUser?.email) {
      await sendMail(
        publisherUser.email,
        '❌ Booking has been Cancelled by User',
        `${booking.bookedBy} cancelled the booking.`,
        `<h3>Hi ${publisherUser.username},</h3>
         <p><strong>${booking.bookedBy}</strong> has cancelled their booking for your ride.</p>
         <p>Freed Seats: ${booking.seatsBooked}</p>`
      );
    }

    await BookedRide.findByIdAndDelete(bookingId);
    res.status(200).json({ message: 'Booking cancelled successfully.' });
  } catch (err) {
    console.error('Cancel booked ride error:', err);
    res.status(500).json({ message: 'Error cancelling booking.' });
  }
});

module.exports = router;
