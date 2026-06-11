const express = require('express');
const { pool } = require('../server');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// Create Comment
router.post('/', authenticate, async (req, res) => {
  try {
    const { postId, content, parentCommentId = null } = req.body;

    const result = await pool.query(
      'INSERT INTO comments (post_id, user_id, parent_comment_id, content) VALUES ($1, $2, $3, $4) RETURNING *',
      [postId, req.user.userId, parentCommentId, content]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get Post Comments
router.get('/post/:postId', async (req, res) => {
  try {
    const { postId } = req.params;

    const result = await pool.query(
      `SELECT c.*, u.username, u.display_name, u.profile_picture,
              (SELECT COUNT(*) FROM likes WHERE comment_id = c.id) as like_count
       FROM comments c
       JOIN users u ON c.user_id = u.id
       WHERE c.post_id = $1 AND c.parent_comment_id IS NULL
       ORDER BY c.created_at DESC`,
      [postId]
    );

    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get Comment Replies
router.get('/:commentId/replies', async (req, res) => {
  try {
    const { commentId } = req.params;

    const result = await pool.query(
      `SELECT c.*, u.username, u.display_name, u.profile_picture,
              (SELECT COUNT(*) FROM likes WHERE comment_id = c.id) as like_count
       FROM comments c
       JOIN users u ON c.user_id = u.id
       WHERE c.parent_comment_id = $1
       ORDER BY c.created_at ASC`,
      [commentId]
    );

    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update Comment
router.put('/:commentId', authenticate, async (req, res) => {
  try {
    const { commentId } = req.params;
    const { content } = req.body;

    const commentCheck = await pool.query('SELECT user_id FROM comments WHERE id = $1', [commentId]);
    if (commentCheck.rows.length === 0 || commentCheck.rows[0].user_id !== req.user.userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    await pool.query(
      'UPDATE comments SET content = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
      [content, commentId]
    );

    res.json({ message: 'Comment updated' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete Comment
router.delete('/:commentId', authenticate, async (req, res) => {
  try {
    const { commentId } = req.params;

    const commentCheck = await pool.query('SELECT user_id FROM comments WHERE id = $1', [commentId]);
    if (commentCheck.rows.length === 0 || commentCheck.rows[0].user_id !== req.user.userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    await pool.query('DELETE FROM comments WHERE id = $1', [commentId]);
    res.json({ message: 'Comment deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
