const express = require('express');
const { pool } = require('../server');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// Send Message
router.post('/', authenticate, async (req, res) => {
  try {
    const { recipientId, content, imageUrl = null } = req.body;

    const result = await pool.query(
      'INSERT INTO messages (sender_id, recipient_id, content, image_url) VALUES ($1, $2, $3, $4) RETURNING *',
      [req.user.userId, recipientId, content, imageUrl]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get Conversation
router.get('/conversation/:recipientId', authenticate, async (req, res) => {
  try {
    const { recipientId } = req.params;

    const result = await pool.query(
      `SELECT * FROM messages
       WHERE (sender_id = $1 AND recipient_id = $2) OR (sender_id = $2 AND recipient_id = $1)
       ORDER BY created_at ASC`,
      [req.user.userId, recipientId]
    );

    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get Message Threads
router.get('/threads', authenticate, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT DISTINCT CASE
         WHEN sender_id = $1 THEN recipient_id
         ELSE sender_id
       END as user_id,
       u.username, u.display_name, u.profile_picture,
       MAX(m.created_at) as last_message_at
       FROM messages m
       JOIN users u ON u.id = CASE WHEN m.sender_id = $1 THEN m.recipient_id ELSE m.sender_id END
       WHERE m.sender_id = $1 OR m.recipient_id = $1
       GROUP BY user_id, u.username, u.display_name, u.profile_picture
       ORDER BY MAX(m.created_at) DESC`,
      [req.user.userId]
    );

    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
