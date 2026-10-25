const express = require('express');
const router = express.Router();
const FeedPost = require('../models/FeedPost');
const { authenticateToken } = require('../middleware/auth');

const formatPost = (post, currentUserId = null) => {
  const isLiked = currentUserId && post.liked_by 
    ? post.liked_by.some(id => id.toString() === currentUserId.toString())
    : false;

  return {
    id: post._id,
    _id: post._id,
    committee: post.committee_name,
    tagline: post.badge || 'Campus Update',
    avatar: (post.committee_name || 'CH').slice(0, 2).toUpperCase(),
    time: new Date(post.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' }),
    badge: post.badge || 'Announcement',
    badgeColor: post.badge === 'Recruiting' 
      ? 'bg-[#FDE8E1] text-[#C87D55] dark:bg-[#3D251E] dark:text-[#FFB74D]'
      : 'bg-[#E1F3E6] text-[#2D6A4F] dark:bg-[#1C3A27] dark:text-[#81C784]',
    caption: post.caption,
    mediaType: post.media_type,
    mediaUrl: post.media_url,
    posterUrl: post.poster_url || post.media_url,
    likes: post.likes || 0,
    isLiked: isLiked,
    comments: (post.comments || []).map(c => ({
      id: c._id,
      user: c.user || 'Campus user',
      text: c.comment,
      time: new Date(c.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }))
  };
};

// GET /api/feed/posts
router.get('/posts', async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 6, 1), 50);
    const skip = (page - 1) * limit;

    const [posts, total] = await Promise.all([
      FeedPost.find().sort({ createdAt: -1 }).skip(skip).limit(limit),
      FeedPost.countDocuments()
    ]);

    res.json({
      success: true,
      page,
      limit,
      total_records: total,
      data: posts.map(p => formatPost(p))
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/feed - Create post
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { committee_name, media_type, media_url, poster_url, caption, badge } = req.body;
    
    if (!caption || !media_url) {
      return res.status(400).json({ success: false, error: 'Caption and media URL are required' });
    }

    const post = await FeedPost.create({
      author_id: req.user?.id,
      committee_name: committee_name || 'Campus Committee',
      media_type: media_type || 'image',
      media_url,
      poster_url: poster_url || (media_type === 'video' ? media_url : null),
      caption,
      badge: badge || 'Announcement',
      likes: 0
    });

    res.status(201).json({ success: true, data: formatPost(post) });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/feed/posts/:id/comments - Add comment
router.post('/posts/:id/comments', authenticateToken, async (req, res) => {
  try {
    const comment = String(req.body.comment || '').trim();
    if (!comment) {
      return res.status(400).json({ success: false, error: 'Comment text is required' });
    }

    const post = await FeedPost.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ success: false, error: 'Post not found' });
    }

    const authorName = req.user?.email ? req.user.email.split('@')[0] : 'Campus user';
    const newComment = {
      author_id: req.user?.id,
      user: req.user?.name || authorName,
      comment,
      createdAt: new Date()
    };

    post.comments.push(newComment);
    await post.save();

    const savedComment = post.comments[post.comments.length - 1];
    res.status(201).json({
      success: true,
      data: {
        id: savedComment._id,
        user: savedComment.user,
        text: savedComment.comment,
        time: 'Just now'
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/feed/posts/:id/like - Real like toggle
router.post('/posts/:id/like', authenticateToken, async (req, res) => {
  try {
    const post = await FeedPost.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ success: false, error: 'Post not found' });
    }

    const userId = req.user?.id;
    const hasLiked = post.liked_by.some(id => id.toString() === userId.toString());

    if (hasLiked) {
      post.liked_by = post.liked_by.filter(id => id.toString() !== userId.toString());
      post.likes = Math.max((post.likes || 1) - 1, 0);
    } else {
      post.liked_by.push(userId);
      post.likes = (post.likes || 0) + 1;
    }

    await post.save();
    res.json({ success: true, likes: post.likes, isLiked: !hasLiked });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
