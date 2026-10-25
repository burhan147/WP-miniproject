const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  author_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  user: {
    type: String,
    default: 'Campus user'
  },
  comment: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const feedPostSchema = new mongoose.Schema({
  author_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  committee_name: {
    type: String,
    required: true
  },
  media_type: {
    type: String,
    enum: ['image', 'video'],
    default: 'image'
  },
  media_url: {
    type: String,
    required: true
  },
  poster_url: {
    type: String
  },
  caption: {
    type: String,
    required: true
  },
  badge: {
    type: String,
    default: 'Announcement'
  },
  likes: {
    type: Number,
    default: 0
  },
  liked_by: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  comments: [commentSchema]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

module.exports = mongoose.model('FeedPost', feedPostSchema);
