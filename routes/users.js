const express = require('express');
const { pool } = require('../server');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// Get User Profile
router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    const userResult = await pool.query(
      'SELECT id, username, display_name, bio, profile_picture, cover_photo, country, city, created_at FROM users WHERE id = $1',
      [userId]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = userResult.rows[0];

    // Get stats
    const followersResult = await pool.query(
      'SELECT COUNT(*) FROM follows WHERE following_id = $1',
      [userId]
    );

    const followingResult = await pool.query(
      'SELECT COUNT(*) FROM follows WHERE follower_id = $1',
      [userId]
    );

    const postsResult = await pool.query(
      'SELECT COUNT(*) FROM posts WHERE user_id = $1',
      [userId]
    );

    const interestsResult = await pool.query(
      'SELECT interest FROM user_interests WHERE user_id = $1',
      [userId]
    );

    res.json({
      ...user,
      followers: parseInt(followersResult.rows[0].count),
      following: parseInt(followingResult.rows[0].count),
      posts: parseInt(postsResult.rows[0].count),
      interests: interestsResult.rows.map(r => r.interest)
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update Profile
router.put('/:userId', authenticate, async (req, res) => {
  try {
    const { userId } = req.params;
    const { displayName, bio, country, city, profilePicture, coverPhoto, interests } = req.body;

    if (parseInt(userId) !== req.user.userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    await pool.query(
      'UPDATE users SET display_name = $1, bio = $2, country = $3, city = $4, profile_picture = $5, cover_photo = $6, updated_at = CURRENT_TIMESTAMP WHERE id = $7',
      [displayName, bio, country, city, profilePicture, coverPhoto, userId]
    );

    if (interests && interests.length > 0) {
      await pool.query('DELETE FROM user_interests WHERE user_id = $1', [userId]);
      for (const interest of interests) {
        await pool.query(
          'INSERT INTO user_interests (user_id, interest) VALUES ($1, $2)',
          [userId, interest]
        );
      }
    }

    res.json({ message: 'Profile updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get User's Posts
router.get('/:userId/posts', async (req, res) => {
  try {
    const { userId } = req.params;
    const { limit = 10, offset = 0 } = req.query;

    const result = await pool.query(
      'SELECT * FROM posts WHERE user_id = $1 ORDER BY created_at DESC LIMIT $2 OFFSET $3',
      [userId, limit, offset]
    );

    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
