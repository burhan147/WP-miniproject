const mongoose = require('mongoose');

const committeeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  description: {
    type: String,
    default: 'Campus committee.'
  },
  category: {
    type: String,
    enum: ['Technical', 'Cultural', 'Media', 'Sports'],
    default: 'Technical'
  },
  contact_email: {
    type: String
  },
  logo_url: {
    type: String
  },
  is_recruiting: {
    type: Boolean,
    default: true
  },
  lead: {
    type: String,
    default: 'Committee Executive'
  },
  website: {
    type: String,
    default: '#'
  },
  departments: {
    type: [String],
    default: ['General']
  },
  rating: {
    type: Number,
    default: 4.5
  },
  reviews_count: {
    type: Number,
    default: 0
  },
  members: {
    type: Number,
    default: 50
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

module.exports = mongoose.model('Committee', committeeSchema);
