const express = require('express');
const { pool } = require('../server');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// Create Bot
router.post('/', authenticate, async (req, res) => {
  try {
    const { name, avatar, title, description, greetingMessage, personality, scenario, isPublic = true, tags = [] } = req.body;

    const result = await pool.query(
      'INSERT INTO ai_bots (user_id, name, avatar, title, description, greeting_message, personality, scenario, is_public) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *',
      [req.user.userId, name, avatar, title, description, greetingMessage, personality, scenario, isPublic]
    );

    const bot = result.rows[0];

    if (tags.length > 0) {
      for (const tag of tags) {
        await pool.query(
          'INSERT INTO bot_tags (bot_id, tag) VALUES ($1, $2)',
          [bot.id, tag]
        );
      }
    }

    res.status(201).json(bot);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get Public Bots
router.get('/', async (req, res) => {
  try {
    const { limit = 20, offset = 0 } = req.query;

    const result = await pool.query(
      `SELECT b.*, u.username, u.display_name, u.profile_picture
       FROM ai_bots b
       JOIN users u ON b.user_id = u.id
       WHERE b.is_public = true
       ORDER BY b.created_at DESC
       LIMIT $1 OFFSET $2`,
      [limit, offset]
    );

    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get User's Bots
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    const result = await pool.query(
      'SELECT * FROM ai_bots WHERE user_id = $1 ORDER BY created_at DESC',
      [userId]
    );

    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get Bot Details
router.get('/:botId', async (req, res) => {
  try {
    const { botId } = req.params;

    const result = await pool.query(
      `SELECT b.*, u.username, u.display_name, u.profile_picture,
              (SELECT array_agg(tag) FROM bot_tags WHERE bot_id = b.id) as tags
       FROM ai_bots b
       JOIN users u ON b.user_id = u.id
       WHERE b.id = $1`,
      [botId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Bot not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start Chat
router.post('/:botId/chat', authenticate, async (req, res) => {
  try {
    const { botId } = req.params;

    const result = await pool.query(
      'INSERT INTO ai_chats (user_id, bot_id) VALUES ($1, $2) RETURNING *',
      [req.user.userId, botId]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Send Chat Message
router.post('/chat/:chatId/message', authenticate, async (req, res) => {
  try {
    const { chatId } = req.params;
    const { content } = req.body;

    await pool.query(
      'INSERT INTO ai_chat_messages (chat_id, sender_type, content) VALUES ($1, $2, $3)',
      [chatId, 'user', content]
    );

    const botResponse = `This is a placeholder response. Integrate with your AI API for real responses.`;

    const result = await pool.query(
      'INSERT INTO ai_chat_messages (chat_id, sender_type, content) VALUES ($1, $2, $3) RETURNING *',
      [chatId, 'bot', botResponse]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
