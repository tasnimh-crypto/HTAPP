const express = require('express');
const { pool } = require('../server');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// Like Post
router.post('/post/:postId', authenticate, async (req, res) => {
  try {
    const { postId } = req.params;
    const { reactionType = 'love' } = req.body;

    const existingLike = await pool.query(
      'SELECT * FROM likes WHERE user_id = $1 AND post_id = $2',
      [req.user.userId, postId]
    );

    if (existingLike.rows.length > 0) {
      await pool.query(
        'DELETE FROM likes WHERE user_id = $1 AND post_id = $2',
        [req.user.userId, postId]
      );
      return res.json({ liked: false });
    }

    await pool.query(
      'INSERT INTO likes (user_id, post_id, reaction_type) VALUES ($1, $2, $3)',
      [req.user.userId, postId, reactionType]
    );

    res.status(201).json({ liked: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Like Comment
router.post('/comment/:commentId', authenticate, async (req, res) => {
  try {
    const { commentId } = req.params;

    const existingLike = await pool.query(
      'SELECT * FROM likes WHERE user_id = $1 AND comment_id = $2',
      [req.user.userId, commentId]
    );

    if (existingLike.rows.length > 0) {
      await pool.query(
        'DELETE FROM likes WHERE user_id = $1 AND comment_id = $2',
        [req.user.userId, commentId]
      );
      return res.json({ liked: false });
    }

    await pool.query(
      'INSERT INTO likes (user_id, comment_id) VALUES ($1, $2)',
      [req.user.userId, commentId]
    );

    res.status(201).json({ liked: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Save Post
router.post('/save/:postId', authenticate, async (req, res) => {
  try {
    const { postId } = req.params;

    const existingSave = await pool.query(
      'SELECT * FROM saves WHERE user_id = $1 AND post_id = $2',
      [req.user.userId, postId]
    );

    if (existingSave.rows.length > 0) {
      await pool.query(
        'DELETE FROM saves WHERE user_id = $1 AND post_id = $2',
        [req.user.userId, postId]
      );
      return res.json({ saved: false });
    }

    await pool.query(
      'INSERT INTO saves (user_id, post_id) VALUES ($1, $2)',
      [req.user.userId, postId]
    );

    res.status(201).json({ saved: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get Saved Posts
router.get('/user/:userId', authenticate, async (req, res) => {
  try {
    const { userId } = req.params;

    if (parseInt(userId) !== req.user.userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const result = await pool.query(
      `SELECT p.* FROM posts p
       JOIN saves s ON p.id = s.post_id
       WHERE s.user_id = $1
       ORDER BY s.created_at DESC`,
      [userId]
    );

    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
