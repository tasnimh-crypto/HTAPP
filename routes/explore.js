const express = require('express');
const { pool } = require('../server');

const router = express.Router();

// Get Trending Tags
router.get('/trending-tags', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT tag, COUNT(*) as count FROM post_tags
       GROUP BY tag
       ORDER BY count DESC
       LIMIT 20`
    );

    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get Posts by Tag
router.get('/tag/:tag', async (req, res) => {
  try {
    const { tag } = req.params;
    const { limit = 20, offset = 0 } = req.query;

    const result = await pool.query(
      `SELECT p.*, u.username, u.display_name, u.profile_picture
       FROM posts p
       JOIN users u ON p.user_id = u.id
       JOIN post_tags pt ON p.id = pt.post_id
       WHERE pt.tag = $1
       ORDER BY p.created_at DESC
       LIMIT $2 OFFSET $3`,
      [tag, limit, offset]
    );

    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get Trending Posts
router.get('/trending-posts', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT p.*, u.username, u.display_name, u.profile_picture,
              (SELECT COUNT(*) FROM likes WHERE post_id = p.id) as like_count,
              (SELECT COUNT(*) FROM comments WHERE post_id = p.id) as comment_count
       FROM posts p
       JOIN users u ON p.user_id = u.id
       WHERE p.created_at > NOW() - INTERVAL '7 days'
       ORDER BY ((SELECT COUNT(*) FROM likes WHERE post_id = p.id) + 
                 (SELECT COUNT(*) FROM comments WHERE post_id = p.id)) DESC
       LIMIT 20`
    );

    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get Categories
router.get('/categories', async (req, res) => {
  const categories = [
    'Dark Academia',
    'Dreamcore',
    'Study Motivation',
    'Universities',
    'Vision Boards',
    'Writing',
    'Photography',
    'Poetry',
    'Cottagecore',
    'Cybercore',
    'Y2K',
    'Travel'
  ];

  res.json({ categories });
});

module.exports = router;
