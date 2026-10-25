const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Committee = require('../models/Committee');
const Event = require('../models/Event');
const Review = require('../models/Review');
const LostFound = require('../models/LostFound');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

router.get('/overview', authenticateToken, authorizeRoles('ADMIN'), async (req, res) => {
  try {
    const [users, committees, events, reviews, openLost, openFound] = await Promise.all([
      User.countDocuments(),
      Committee.countDocuments(),
      Event.countDocuments(),
      Review.countDocuments(),
      LostFound.countDocuments({ type: 'LOST', status: 'OPEN' }),
      LostFound.countDocuments({ type: 'FOUND', status: 'OPEN' })
    ]);

    res.status(200).json({
      success: true,
      data: {
        users,
        committees,
        events,
        reviews,
        open_lost_items: openLost,
        open_found_items: openFound
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
