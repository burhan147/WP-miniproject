const express = require('express');
const crypto = require('crypto');
const router = express.Router();
const Review = require('../models/Review');
const Committee = require('../models/Committee');
const { authenticateToken } = require('../middleware/auth');

const hashUserId = (userId) => {
  const secret = process.env.JWT_SECRET || 'peerly_super_secure_jwt_secret_token_2026';
  return crypto.createHmac('sha256', secret).update(String(userId)).digest('hex');
};

// POST /api/reviews
router.post('/', authenticateToken, async (req, res) => {
  try {
    let { committee_id, cycle_id, rating, ratings, comment, review_text } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ success: false, error: 'User ID missing from token' });
    }

    // Resolve committee_id if it's committee name or ObjectId
    if (committee_id && !committee_id.match(/^[0-9a-fA-F]{24}$/)) {
      const comm = await Committee.findOne({ $or: [{ name: committee_id }, { id: committee_id }] });
      if (comm) committee_id = comm._id;
    }

    const anonymous_hash = hashUserId(userId);
    const scoreVal = ratings?.score || rating || 5;

    const review = await Review.create({
      committee_id,
      cycle_id: cycle_id || null,
      user_id_hash: anonymous_hash,
      ratings: { score: Number(scoreVal) },
      comment: review_text || comment
    });

    // Update committee reviews count & average rating
    const allReviews = await Review.find({ committee_id });
    if (allReviews.length > 0) {
      const avg = allReviews.reduce((sum, r) => sum + (r.ratings?.score || 5), 0) / allReviews.length;
      await Committee.findByIdAndUpdate(committee_id, {
        rating: Math.round(avg * 10) / 10,
        reviews_count: allReviews.length
      });
    }

    res.status(201).json({ success: true, data: review });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/reviews/committee/:id
router.get('/committee/:id', async (req, res) => {
  try {
    let commId = req.params.id;
    if (!commId.match(/^[0-9a-fA-F]{24}$/)) {
      const comm = await Committee.findOne({ $or: [{ name: commId }, { id: commId }] });
      if (comm) commId = comm._id;
    }

    const reviews = await Review.find({ committee_id: commId, is_hidden: false })
      .sort({ createdAt: -1 });

    const formatted = reviews.map(r => ({
      id: r._id,
      ratings: r.ratings,
      comment: r.comment,
      created_at: r.createdAt
    }));

    res.status(200).json({ success: true, data: formatted });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
