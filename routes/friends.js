const express = require('express');
const { pool } = require('../server');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// Send Friend Request
router.post('/request/:receiverId', authenticate, async (req, res) => {
  try {
    const { receiverId } = req.params;

    if (parseInt(receiverId) === req.user.userId) {
      return res.status(400).json({ error: 'Cannot friend yourself' });
    }

    const existingRequest = await pool.query(
      'SELECT * FROM friend_requests WHERE sender_id = $1 AND receiver_id = $2',
      [req.user.userId, receiverId]
    );

    if (existingRequest.rows.length > 0) {
      return res.status(400).json({ error: 'Friend request already sent' });
    }

    await pool.query(
      'INSERT INTO friend_requests (sender_id, receiver_id) VALUES ($1, $2)',
      [req.user.userId, receiverId]
    );

    res.status(201).json({ message: 'Friend request sent' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Accept Friend Request
router.post('/accept/:requestId', authenticate, async (req, res) => {
  try {
    const { requestId } = req.params;

    const requestResult = await pool.query(
      'SELECT * FROM friend_requests WHERE id = $1 AND receiver_id = $2',
      [requestId, req.user.userId]
    );

    if (requestResult.rows.length === 0) {
      return res.status(404).json({ error: 'Friend request not found' });
    }

    const { sender_id, receiver_id } = requestResult.rows[0];

    await pool.query('UPDATE friend_requests SET status = $1 WHERE id = $2', ['accepted', requestId]);
    await pool.query(
      'INSERT INTO friendships (user_id_1, user_id_2) VALUES ($1, $2)',
      [Math.min(sender_id, receiver_id), Math.max(sender_id, receiver_id)]
    );

    res.json({ message: 'Friend request accepted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get Friends
router.get('/:userId/friends', async (req, res) => {
  try {
    const { userId } = req.params;

    const result = await pool.query(
      `SELECT u.id, u.username, u.display_name, u.profile_picture, u.country
       FROM users u
       JOIN friendships f ON (u.id = f.user_id_1 OR u.id = f.user_id_2)
       WHERE (f.user_id_1 = $1 OR f.user_id_2 = $1) AND u.id != $1
       ORDER BY f.created_at DESC`,
      [userId]
    );

    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
