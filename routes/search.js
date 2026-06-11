const express = require('express');
const { pool } = require('../server');

const router = express.Router();

// Global Search
router.get('/', async (req, res) => {
  try {
    const { q, type = 'all' } = req.query;

    if (!q || q.length < 2) {
      return res.status(400).json({ error: 'Query too short' });
    }

    const searchTerm = `%${q}%`;
    const results = {};

    if (type === 'all' || type === 'users') {
      const userResults = await pool.query(
        `SELECT id, username, display_name, profile_picture, country FROM users
         WHERE username ILIKE $1 OR display_name ILIKE $1
         LIMIT 10`,
        [searchTerm]
      );
      results.users = userResults.rows;
    }

    if (type === 'all' || type === 'posts') {
      const postResults = await pool.query(
        `SELECT p.id, p.title, p.content, p.created_at, u.username, u.display_name
         FROM posts p
         JOIN users u ON p.user_id = u.id
         WHERE p.title ILIKE $1 OR p.content ILIKE $1
         LIMIT 10`,
        [searchTerm]
      );
      results.posts = postResults.rows;
    }

    if (type === 'all' || type === 'tags') {
      const tagResults = await pool.query(
        `SELECT DISTINCT tag FROM post_tags
         WHERE tag ILIKE $1
         LIMIT 10`,
        [searchTerm]
      );
      results.tags = tagResults.rows.map(r => r.tag);
    }

    if (type === 'all' || type === 'communities') {
      const communityResults = await pool.query(
        `SELECT id, name, description FROM communities
         WHERE name ILIKE $1 OR description ILIKE $1
         LIMIT 10`,
        [searchTerm]
      );
      results.communities = communityResults.rows;
    }

    res.json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
