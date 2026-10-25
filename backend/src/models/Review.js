const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  committee_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Committee',
    required: true
  },
  cycle_id: {
    type: String,
    default: null
  },
  user_id_hash: {
    type: String,
    required: true
  },
  ratings: {
    score: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    }
  },
  comment: {
    type: String,
    required: true
  },
  is_hidden: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

module.exports = mongoose.model('Review', reviewSchema);
