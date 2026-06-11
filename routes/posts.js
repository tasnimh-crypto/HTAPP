const express = require('express');
const { pool } = require('../server');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// Create Post
router.post('/', authenticate, async (req, res) => {
  try {
    const { title, content, postType = 'text', imageUrl, videoUrl, isPublic = true, tags = [] } = req.body;

    const result = await pool.query(
      'INSERT INTO posts (user_id, title, content, post_type, image_url, video_url, is_public) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [req.user.userId, title, content, postType, imageUrl, videoUrl, isPublic]
    );

    const post = result.rows[0];

    if (tags.length > 0) {
      for (const tag of tags) {
        await pool.query(
          'INSERT INTO post_tags (post_id, tag) VALUES ($1, $2)',
          [post.id, tag]
        );
      }
    }

    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get Feed
router.get('/feed', authenticate, async (req, res) => {
  try {
    const { limit = 20, offset = 0 } = req.query;

    const result = await pool.query(
      `SELECT p.*, u.username, u.display_name, u.profile_picture,
              (SELECT COUNT(*) FROM likes WHERE post_id = p.id) as like_count,
              (SELECT COUNT(*) FROM comments WHERE post_id = p.id) as comment_count,
              (SELECT COUNT(*) FROM saves WHERE post_id = p.id) as save_count
       FROM posts p
       JOIN users u ON p.user_id = u.id
       WHERE p.is_public = true
       ORDER BY p.created_at DESC
       LIMIT $1 OFFSET $2`,
      [limit, offset]
    );

    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get Post Details
router.get('/:postId', async (req, res) => {
  try {
    const { postId } = req.params;

    const result = await pool.query(
      `SELECT p.*, u.username, u.display_name, u.profile_picture,
              (SELECT COUNT(*) FROM likes WHERE post_id = p.id) as like_count,
              (SELECT COUNT(*) FROM comments WHERE post_id = p.id) as comment_count,
              (SELECT COUNT(*) FROM saves WHERE post_id = p.id) as save_count
       FROM posts p
       JOIN users u ON p.user_id = u.id
       WHERE p.id = $1`,
      [postId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Post not found' });
    }

    await pool.query('UPDATE posts SET views = views + 1 WHERE id = $1', [postId]);

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update Post
router.put('/:postId', authenticate, async (req, res) => {
  try {
    const { postId } = req.params;
    const { title, content, imageUrl, videoUrl, isPublic } = req.body;

    const postCheck = await pool.query('SELECT user_id FROM posts WHERE id = $1', [postId]);
    if (postCheck.rows.length === 0 || postCheck.rows[0].user_id !== req.user.userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    await pool.query(
      'UPDATE posts SET title = $1, content = $2, image_url = $3, video_url = $4, is_public = $5, updated_at = CURRENT_TIMESTAMP WHERE id = $6',
      [title, content, imageUrl, videoUrl, isPublic, postId]
    );

    res.json({ message: 'Post updated' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete Post
router.delete('/:postId', authenticate, async (req, res) => {
  try {
    const { postId } = req.params;

    const postCheck = await pool.query('SELECT user_id FROM posts WHERE id = $1', [postId]);
    if (postCheck.rows.length === 0 || postCheck.rows[0].user_id !== req.user.userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    await pool.query('DELETE FROM posts WHERE id = $1', [postId]);
    res.json({ message: 'Post deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
