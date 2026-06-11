const express = require('express');
const { pool } = require('../server');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// Follow User
router.post('/:followingId', authenticate, async (req, res) => {
  try {
    const { followingId } = req.params;

    if (parseInt(followingId) === req.user.userId) {
      return res.status(400).json({ error: 'Cannot follow yourself' });
    }

    const existingFollow = await pool.query(
      'SELECT * FROM follows WHERE follower_id = $1 AND following_id = $2',
      [req.user.userId, followingId]
    );

    if (existingFollow.rows.length > 0) {
      await pool.query(
        'DELETE FROM follows WHERE follower_id = $1 AND following_id = $2',
        [req.user.userId, followingId]
      );
      return res.json({ following: false });
    }

    await pool.query(
      'INSERT INTO follows (follower_id, following_id) VALUES ($1, $2)',
      [req.user.userId, followingId]
    );

    res.status(201).json({ following: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get Followers
router.get('/:userId/followers', async (req, res) => {
  try {
    const { userId } = req.params;

    const result = await pool.query(
      `SELECT u.id, u.username, u.display_name, u.profile_picture, u.country
       FROM users u
       JOIN follows f ON u.id = f.follower_id
       WHERE f.following_id = $1
       ORDER BY f.created_at DESC`,
      [userId]
    );

    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get Following
router.get('/:userId/following', async (req, res) => {
  try {
    const { userId } = req.params;

    const result = await pool.query(
      `SELECT u.id, u.username, u.display_name, u.profile_picture, u.country
       FROM users u
       JOIN follows f ON u.id = f.following_id
       WHERE f.follower_id = $1
       ORDER BY f.created_at DESC`,
      [userId]
    );

    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
