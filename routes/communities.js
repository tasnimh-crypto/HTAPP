const express = require('express');
const { pool } = require('../server');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// Create Community
router.post('/', authenticate, async (req, res) => {
  try {
    const { name, description, banner, category, isPublic = true } = req.body;

    const result = await pool.query(
      'INSERT INTO communities (owner_id, name, description, banner, category, is_public) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [req.user.userId, name, description, banner, category, isPublic]
    );

    const community = result.rows[0];

    // Add owner as member
    await pool.query(
      'INSERT INTO community_members (community_id, user_id, role) VALUES ($1, $2, $3)',
      [community.id, req.user.userId, 'owner']
    );

    res.status(201).json(community);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get Community Details
router.get('/:communityId', async (req, res) => {
  try {
    const { communityId } = req.params;

    const result = await pool.query(
      `SELECT c.*, u.username, u.display_name,
              (SELECT COUNT(*) FROM community_members WHERE community_id = c.id) as member_count
       FROM communities c
       JOIN users u ON c.owner_id = u.id
       WHERE c.id = $1`,
      [communityId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Community not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Join Community
router.post('/:communityId/join', authenticate, async (req, res) => {
  try {
    const { communityId } = req.params;

    const existingMembership = await pool.query(
      'SELECT * FROM community_members WHERE community_id = $1 AND user_id = $2',
      [communityId, req.user.userId]
    );

    if (existingMembership.rows.length > 0) {
      return res.status(400).json({ error: 'Already a member' });
    }

    await pool.query(
      'INSERT INTO community_members (community_id, user_id, role) VALUES ($1, $2, $3)',
      [communityId, req.user.userId, 'member']
    );

    res.status(201).json({ message: 'Joined community' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Post in Community
router.post('/:communityId/post', authenticate, async (req, res) => {
  try {
    const { communityId } = req.params;
    const { content, imageUrl = null } = req.body;

    const result = await pool.query(
      'INSERT INTO community_posts (community_id, user_id, content, image_url) VALUES ($1, $2, $3, $4) RETURNING *',
      [communityId, req.user.userId, content, imageUrl]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get Community Posts
router.get('/:communityId/posts', async (req, res) => {
  try {
    const { communityId } = req.params;

    const result = await pool.query(
      `SELECT cp.*, u.username, u.display_name, u.profile_picture
       FROM community_posts cp
       JOIN users u ON cp.user_id = u.id
       WHERE cp.community_id = $1
       ORDER BY cp.created_at DESC`,
      [communityId]
    );

    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
