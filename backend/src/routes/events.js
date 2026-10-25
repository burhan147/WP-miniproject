const express = require('express');
const router = express.Router();
const Event = require('../models/Event');
const Committee = require('../models/Committee');
const { authenticate, authorize } = require('../middleware/auth');

// GET EVENTS (With optional category filter & date timeframe)
router.get('/', async (req, res) => {
  try {
    const { category, timeframe } = req.query;
    let query = {};

    if (category && category !== 'All') {
      query.category = category;
    }

    const now = new Date();

    if (timeframe === 'today') {
      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date();
      endOfDay.setHours(23, 59, 59, 999);
      query.start_time = { $gte: startOfDay, $lte: endOfDay };
    } else if (timeframe === 'now') {
      query.start_time = { $lte: now };
      query.end_time = { $gte: now };
    }

    const events = await Event.find(query)
      .populate('committee_id', 'name logo_url')
      .sort({ start_time: 1 });

    const formattedEvents = events.map(evt => {
      const startDate = new Date(evt.start_time);
      const day = startDate.getDate();
      const monthNames = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
      const monthStr = monthNames[startDate.getMonth()];
      const timeStr = startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
      
      const tagColors = {
        Workshop: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300',
        Cultural: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300',
        Social: 'bg-stone-200 text-stone-800 dark:bg-stone-800 dark:text-stone-300',
        Tech: 'bg-orange-100 text-orange-800 dark:bg-orange-950 dark:text-orange-300'
      };

      return {
        id: evt._id,
        _id: evt._id,
        day,
        dateStr: `${day} ${monthStr}`,
        title: evt.title,
        committee: evt.committee_id?.name || 'Campus Society',
        time: timeStr,
        venue: evt.location,
        going: evt.going_count || 12,
        tag: evt.category || 'Workshop',
        tagColor: tagColors[evt.category] || tagColors.Workshop,
        description: evt.description,
        reg_link: evt.reg_link,
        start_time: evt.start_time,
        end_time: evt.end_time
      };
    });

    res.status(200).json({ success: true, data: formattedEvents });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// CREATE EVENT
router.post('/', authenticate, authorize('ADMIN', 'COMMITTEE_HEAD'), async (req, res) => {
  try {
    let { committee_id, title, category, start_time, end_time, location, description, reg_link, is_recruiting } = req.body;

    // If committee_id is a name or invalid, look up or assign
    if (committee_id && !committee_id.match(/^[0-9a-fA-F]{24}$/)) {
      const existing = await Committee.findOne({ name: committee_id });
      committee_id = existing ? existing._id : null;
    }

    const event = await Event.create({
      committee_id: committee_id || null,
      title,
      category: category || 'Workshop',
      start_time: new Date(start_time),
      end_time: new Date(end_time),
      location,
      description: description || '',
      reg_link: reg_link || '',
      is_recruiting: Boolean(is_recruiting)
    });

    res.status(201).json({ success: true, data: event });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
