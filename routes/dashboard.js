const express = require('express');
const router = express.Router();

const Dashboard = require('../models/Dashboard');
const User = require('../models/User');
const UserRides = require('../models/UserRides');
const BookedRide = require('../models/BookedRide');

//GET: Dashboard for a specific user
router.get('/:userId', async (req, res) => {
  try {
    const dashboard = await Dashboard.findOne({ user: req.params.userId })
      .populate('user', 'username email uniqueCode')
      .populate({
        path: 'publishedRides',
        model: 'UserRides'
      })
      .populate({
        path: 'bookedRides',
        model: 'BookedRide'
      });

    if (!dashboard) {
      return res.status(404).json({ message: 'Dashboard not found for this user' });
    }

    res.status(200).json(dashboard);
  } catch (error) {
    console.error('Dashboard fetch error:', error);
    res.status(500).json({ message: 'Server error while fetching dashboard' });
  }
});

module.exports = router;
