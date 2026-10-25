const express = require('express');
const router = express.Router();
const LostFound = require('../models/LostFound');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

// GET /api/lost-found/summary (Admin only)
router.get('/summary', authenticateToken, authorizeRoles('ADMIN'), async (req, res) => {
  try {
    const [openLost, openFound, resolved] = await Promise.all([
      LostFound.countDocuments({ type: 'LOST', status: 'OPEN' }),
      LostFound.countDocuments({ type: 'FOUND', status: 'OPEN' }),
      LostFound.countDocuments({ status: 'RESOLVED' })
    ]);

    res.json({
      success: true,
      data: {
        open_lost: openLost,
        open_found: openFound,
        resolved: resolved
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/lost-found/match/:id
router.get('/match/:id', async (req, res) => {
  try {
    const lostItem = await LostFound.findById(req.params.id);
    if (!lostItem) {
      return res.status(404).json({ success: false, error: 'Lost item not found' });
    }

    const matches = await LostFound.find({
      type: 'FOUND',
      status: 'OPEN',
      category: lostItem.category,
      location: { $regex: lostItem.location, $options: 'i' }
    }).sort({ createdAt: -1 });

    res.json({ success: true, data: matches });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/lost-found - Report item
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { title, description, category, location, type, image_url, date_lost, contact } = req.body;
    const userId = req.user?.id;

    const item = await LostFound.create({
      title,
      description: description || '',
      category: category || 'General',
      location,
      type: (type || 'LOST').toUpperCase(),
      reporter_id: userId || null,
      contact: contact || req.user?.name || req.user?.email || 'Campus student',
      image_urls: image_url ? [image_url] : [],
      date_lost: date_lost ? new Date(date_lost) : new Date(),
      status: 'OPEN'
    });

    res.status(201).json({ success: true, data: item });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/lost-found - Paginated & Filtered Search
router.get('/', async (req, res) => {
  try {
    const { type, status = 'OPEN', page = 1, limit = 10, category } = req.query;

    let filter = {};
    if (type && type !== 'Everything') {
      filter.type = type.toUpperCase();
    }
    if (status) {
      filter.status = status;
    }
    if (category) {
      filter.category = category;
    }

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const [items, total] = await Promise.all([
      LostFound.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limitNum),
      LostFound.countDocuments(filter)
    ]);

    const formatted = items.map(i => ({
      id: i._id,
      _id: i._id,
      type: i.type === 'LOST' ? 'Lost' : 'Found',
      title: i.title,
      desc: i.description || 'No description provided.',
      location: i.location,
      time: new Date(i.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' }),
      event: 'General Campus',
      contact: i.contact || 'Campus user'
    }));

    res.status(200).json({
      success: true,
      page: pageNum,
      limit: limitNum,
      total_records: total,
      data: formatted
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
