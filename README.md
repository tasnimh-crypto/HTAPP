# 🎨 HTAPP - The Digital Sanctuary for Dreams, Creativity, and Self-Growth

HTAPP is a comprehensive social creativity platform combining Pinterest, Canva, Tumblr, Wattpad, and goal tracking into one cohesive ecosystem.

## 🎯 Core Features

### 1. **Homepage & Feed**
- Personalized feed based on user interests
- Active people discovery
- Friends' shares section
- For You feed with trending content

### 2. **User Profiles**
- Customizable profiles with bio, interests, dream goals
- Profile statistics (followers, following, posts)
- Profile tabs (posts, stories, boards, goals, achievements)
- Follow/Unfollow system

### 3. **Post System**
- Create text, image, video, and quote posts
- Full content management (edit, delete)
- Rich engagement (likes, comments, saves, shares)
- Post tagging and categorization
- Comment threads with replies

### 4. **Story/Novel System**
- Write and publish multi-chapter stories
- Wattpad-style reading experience
- Chapter management
- Story discovery and trending

### 5. **AI Chatbots**
- Create custom AI characters
- Character.AI-style interactions
- Public bot discovery
- Bot tags and categorization

### 6. **Communities**
- Create and join communities
- Community posts and discussions
- Category-based organization
- Member roles (owner, moderator, member)

### 7. **Direct Messaging**
- Real-time chat with socket.io
- Message threads
- Image sharing
- Read receipts

### 8. **Search & Explore**
- Global search (users, posts, tags, communities)
- Trending content
- Category exploration
- Tag-based discovery

## 🛠️ Tech Stack

**Frontend:**
- React.js
- Redux for state management
- Tailwind CSS for styling
- Socket.io-client for real-time features

**Backend:**
- Node.js with Express
- PostgreSQL database
- JWT authentication
- Socket.io for real-time messaging

## 📦 Installation

### Prerequisites
- Node.js (v14+)
- PostgreSQL (v12+)
- npm or yarn

### Setup

```bash
# Clone repository
git clone <repo-url>
cd htapp

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Update .env with your database credentials

# Create database
psql -U postgres -d postgres -c "CREATE DATABASE htapp;"

# Run migrations
psql -U postgres -d htapp -f database/schema.sql

# Seed database
npm run seed

# Start server
npm run dev

# In another terminal, start client
npm run client
```

## 🚀 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Users
- `GET /api/users/:userId` - Get user profile
- `PUT /api/users/:userId` - Update profile
- `GET /api/users/:userId/posts` - Get user posts

### Posts
- `POST /api/posts` - Create post
- `GET /api/posts/feed` - Get personalized feed
- `GET /api/posts/:postId` - Get post details
- `PUT /api/posts/:postId` - Update post
- `DELETE /api/posts/:postId` - Delete post

### Comments
- `POST /api/comments` - Create comment
- `GET /api/comments/post/:postId` - Get post comments
- `GET /api/comments/:commentId/replies` - Get comment replies
- `PUT /api/comments/:commentId` - Update comment
- `DELETE /api/comments/:commentId` - Delete comment

### Likes & Saves
- `POST /api/likes/post/:postId` - Like/unlike post
- `POST /api/likes/comment/:commentId` - Like/unlike comment
- `POST /api/likes/save/:postId` - Save/unsave post
- `GET /api/likes/user/:userId` - Get saved posts

### Follows
- `POST /api/follows/:followingId` - Follow/unfollow user
- `GET /api/follows/:userId/followers` - Get followers
- `GET /api/follows/:userId/following` - Get following

### Friends
- `POST /api/friends/request/:receiverId` - Send friend request
- `POST /api/friends/accept/:requestId` - Accept friend request
- `GET /api/friends/:userId/friends` - Get friends list

### Messages
- `POST /api/messages` - Send message
- `GET /api/messages/conversation/:recipientId` - Get conversation
- `GET /api/messages/threads` - Get message threads

### Stories
- `POST /api/stories` - Create story
- `POST /api/stories/:storyId/chapters` - Add chapter
- `GET /api/stories/:storyId` - Get story details
- `GET /api/stories/:storyId/chapters/:chapterId` - Get chapter
- `GET /api/stories/user/:userId` - Get user stories

### AI Bots
- `POST /api/bots` - Create bot
- `GET /api/bots` - Get public bots
- `GET /api/bots/user/:userId` - Get user's bots
- `GET /api/bots/:botId` - Get bot details
- `POST /api/bots/:botId/chat` - Start chat
- `POST /api/bots/chat/:chatId/message` - Send chat message

### Communities
- `POST /api/communities` - Create community
- `GET /api/communities/:communityId` - Get community details
- `POST /api/communities/:communityId/join` - Join community
- `POST /api/communities/:communityId/post` - Post in community
- `GET /api/communities/:communityId/posts` - Get community posts

### Search & Explore
- `GET /api/search?q=query&type=all` - Global search
- `GET /api/explore/trending-tags` - Trending tags
- `GET /api/explore/tag/:tag` - Posts by tag
- `GET /api/explore/trending-posts` - Trending posts
- `GET /api/explore/categories` - Browse categories

## 📝 Database Schema

See `database/schema.sql` for the complete database structure.

## 🎨 Frontend Setup (Coming Soon)

The React client will include:
- Homepage with personalized feed
- User profile pages
- Post creation and viewing
- Story reading interface
- AI bot chat interface
- Community pages
- Search and explore pages
- Direct messaging interface

## 🔐 Security

- JWT-based authentication
- Password hashing with bcryptjs
- CORS protection
- Input validation
- SQL injection prevention via parameterized queries

## 📄 License

MIT

## 👤 Author

Tasnim H - @tasnimh-crypto
