const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  committee_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Committee',
    required: false
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    enum: ['Workshop', 'Cultural', 'Social', 'Tech'],
    default: 'Workshop'
  },
  start_time: {
    type: Date,
    required: true
  },
  end_time: {
    type: Date,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  reg_link: {
    type: String,
    default: ''
  },
  is_recruiting: {
    type: Boolean,
    default: false
  },
  going_count: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

module.exports = mongoose.model('Event', eventSchema);
