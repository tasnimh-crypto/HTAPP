const express = require('express');
const { pool } = require('../server');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// Create Story
router.post('/', authenticate, async (req, res) => {
  try {
    const { title, description, coverImage, isPublic = true } = req.body;

    const result = await pool.query(
      'INSERT INTO stories (user_id, title, description, cover_image, is_public) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [req.user.userId, title, description, coverImage, isPublic]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add Chapter
router.post('/:storyId/chapters', authenticate, async (req, res) => {
  try {
    const { storyId } = req.params;
    const { chapterNumber, title, content } = req.body;

    const storyCheck = await pool.query('SELECT user_id FROM stories WHERE id = $1', [storyId]);
    if (storyCheck.rows.length === 0 || storyCheck.rows[0].user_id !== req.user.userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const result = await pool.query(
      'INSERT INTO story_chapters (story_id, chapter_number, title, content) VALUES ($1, $2, $3, $4) RETURNING *',
      [storyId, chapterNumber, title, content]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get Story Details
router.get('/:storyId', async (req, res) => {
  try {
    const { storyId } = req.params;

    const storyResult = await pool.query(
      `SELECT s.*, u.username, u.display_name, u.profile_picture,
              (SELECT COUNT(*) FROM story_chapters WHERE story_id = s.id) as chapter_count
       FROM stories s
       JOIN users u ON s.user_id = u.id
       WHERE s.id = $1`,
      [storyId]
    );

    if (storyResult.rows.length === 0) {
      return res.status(404).json({ error: 'Story not found' });
    }

    const chaptersResult = await pool.query(
      'SELECT id, chapter_number, title, created_at FROM story_chapters WHERE story_id = $1 ORDER BY chapter_number ASC',
      [storyId]
    );

    const story = storyResult.rows[0];
    story.chapters = chaptersResult.rows;

    res.json(story);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get Chapter
router.get('/:storyId/chapters/:chapterId', async (req, res) => {
  try {
    const { storyId, chapterId } = req.params;

    const result = await pool.query(
      'SELECT * FROM story_chapters WHERE id = $1 AND story_id = $2',
      [chapterId, storyId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Chapter not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get User Stories
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    const result = await pool.query(
      `SELECT s.*, (SELECT COUNT(*) FROM story_chapters WHERE story_id = s.id) as chapter_count
       FROM stories s
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
