const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { Pool } = require('pg');
const http = require('http');
const socketIo = require('socket.io');

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
});

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use('/uploads', express.static('uploads'));

// Database Connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/posts', require('./routes/posts'));
app.use('/api/comments', require('./routes/comments'));
app.use('/api/likes', require('./routes/likes'));
app.use('/api/follows', require('./routes/follows'));
app.use('/api/friends', require('./routes/friends'));
app.use('/api/messages', require('./routes/messages'));
app.use('/api/stories', require('./routes/stories'));
app.use('/api/bots', require('./routes/bots'));
app.use('/api/communities', require('./routes/communities'));
app.use('/api/search', require('./routes/search'));
app.use('/api/explore', require('./routes/explore'));

// Socket.io Setup
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('join-chat', (userId) => {
    socket.join(`user-${userId}`);
  });

  socket.on('send-message', (data) => {
    io.to(`user-${data.recipientId}`).emit('receive-message', data);
  });

  socket.on('typing', (data) => {
    io.to(`user-${data.recipientId}`).emit('user-typing', { userId: data.userId });
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'HTAPP Server Running' });
});

// Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error'
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`✅ HTAPP Server running on port ${PORT}`);
});

module.exports = { pool, io };
