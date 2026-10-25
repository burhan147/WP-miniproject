const express = require('express');
const router = express.Router();
const Committee = require('../models/Committee');
const { authenticate, authorize } = require('../middleware/auth');

// GET ALL COMMITTEES
router.get('/', async (req, res) => {
  try {
    const data = await Committee.find().sort({ rating: -1, name: 1 });
    res.status(200).json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// CREATE COMMITTEE (ADMIN/COMMITTEE_HEAD ONLY)
router.post('/', authenticate, authorize('ADMIN', 'COMMITTEE_HEAD'), async (req, res) => {
  try {
    const { name, description, category, contact_email, logo_url, is_recruiting, lead, website, departments } = req.body;

    const committee = await Committee.create({
      name,
      description,
      category: category || 'Technical',
      contact_email,
      logo_url,
      is_recruiting: is_recruiting !== undefined ? is_recruiting : true,
      lead: lead || 'Committee Executive',
      website: website || '#',
      departments: departments || ['General']
    });

    res.status(201).json({ success: true, data: committee });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
