# HTAPP - The Digital Sanctuary for Dreams, Creativity, and Self-Growth

## 🎨 Project Overview

HTAPP is a **full-stack social creativity platform** combining the best features of:
- **Pinterest** - Visual inspiration discovery
- **Canva** - Design and creation tools  
- **Tumblr** - Text-based creative expression
- **Wattpad** - Multi-chapter story writing
- **Goal Tracking** - Personal growth tracking
- **Vision Boards** - Dream visualization
- **Communities** - Social connection

### Core Mission
Help users **dream, create, write, save ideas, follow journeys, and connect** with people who share similar aspirations—all in one beautiful, inspiring ecosystem.

---

## 🚀 Quick Start

### Prerequisites
```bash
Node.js v14+
PostgreSQL v12+
npm or yarn
```

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/tasnimh-crypto/HTAPP.git
cd HTAPP

# 2. Install backend dependencies
npm install

# 3. Install frontend dependencies
cd client
npm install
cd ..

# 4. Setup environment variables
cp .env.example .env

# Update .env with your database credentials:
# DATABASE_URL=postgresql://user:password@localhost:5432/htapp
# JWT_SECRET=your_secret_key
# NODE_ENV=development

# 5. Create PostgreSQL database
sudo -u postgres createdb htapp

# 6. Run database migrations
sudo -u postgres psql -d htapp -f database/schema.sql

# 7. Seed the database with demo data
npm run seed

# 8. Start the backend server (Terminal 1)
npm run dev

# 9. Start the frontend (Terminal 2)
npm run client
```

The application will be available at `http://localhost:3000`

---

## 📊 Database Schema

### Core Tables

**users** - User accounts and profiles
- id, username, email, password, display_name, bio, profile_picture, cover_photo, country, city, is_founder, created_at

**user_interests** - User interests for personalization
- id, user_id, interest

**posts** - User posts
- id, user_id, title, content, post_type, image_url, video_url, is_public, views, created_at

**post_tags** - Post categorization
- id, post_id, tag

**comments** - Post comments with threading
- id, post_id, user_id, parent_comment_id, content, created_at

**likes** - Post/comment engagement
- id, user_id, post_id/comment_id, reaction_type, created_at

**follows** - User follow relationships
- id, follower_id, following_id, created_at

**friendships** - Friend connections
- id, user_id_1, user_id_2, created_at

**messages** - Direct messaging
- id, sender_id, recipient_id, content, image_url, is_read, created_at

**stories** - Multi-chapter stories
- id, user_id, title, description, cover_image, status, is_public, created_at

**story_chapters** - Story content
- id, story_id, chapter_number, title, content, created_at

**ai_bots** - AI chatbot characters
- id, user_id, name, avatar, title, description, greeting_message, personality, scenario, is_public, likes, chat_count

**ai_chats** - Conversations with bots
- id, user_id, bot_id, created_at

**communities** - User communities
- id, owner_id, name, description, banner, category, member_count, is_public

**community_members** - Community membership
- id, community_id, user_id, role (owner/moderator/member)

**community_posts** - Posts within communities
- id, community_id, user_id, content, image_url, created_at

---

## 🔌 API Endpoints

### Authentication
```
POST   /api/auth/register          - Register new user
POST   /api/auth/login             - Login user
```

### Users & Profiles
```
GET    /api/users/:userId          - Get user profile
PUT    /api/users/:userId          - Update profile
GET    /api/users/:userId/posts    - Get user's posts
```

### Posts
```
POST   /api/posts                  - Create post
GET    /api/posts/feed             - Get personalized feed
GET    /api/posts/:postId          - Get post details
PUT    /api/posts/:postId          - Update post
DELETE /api/posts/:postId          - Delete post
```

### Comments
```
POST   /api/comments               - Create comment
GET    /api/comments/post/:postId  - Get post comments
GET    /api/comments/:id/replies   - Get comment replies
PUT    /api/comments/:id           - Update comment
DELETE /api/comments/:id           - Delete comment
```

### Engagement
```
POST   /api/likes/post/:postId     - Like/unlike post
POST   /api/likes/comment/:id      - Like/unlike comment
POST   /api/likes/save/:postId     - Save/unsave post
GET    /api/likes/user/:userId     - Get saved posts
```

### Social
```
POST   /api/follows/:userId        - Follow/unfollow user
GET    /api/follows/:userId/followers
GET    /api/follows/:userId/following

POST   /api/friends/request/:userId        - Send friend request
POST   /api/friends/accept/:requestId      - Accept request
GET    /api/friends/:userId/friends        - Get friends
```

### Messages
```
POST   /api/messages               - Send message
GET    /api/messages/conversation/:userId
GET    /api/messages/threads       - Get all conversations
```

### Stories
```
POST   /api/stories                - Create story
POST   /api/stories/:id/chapters   - Add chapter
GET    /api/stories/:id            - Get story details
GET    /api/stories/:id/chapters/:chapterId
GET    /api/stories/user/:userId   - Get user's stories
```

### AI Bots
```
POST   /api/bots                   - Create bot
GET    /api/bots                   - Get public bots
GET    /api/bots/user/:userId      - Get user's bots
GET    /api/bots/:botId            - Get bot details
POST   /api/bots/:botId/chat       - Start chat
POST   /api/bots/chat/:chatId/message
```

### Communities
```
POST   /api/communities            - Create community
GET    /api/communities/:id        - Get community details
POST   /api/communities/:id/join   - Join community
POST   /api/communities/:id/post   - Post in community
GET    /api/communities/:id/posts  - Get community posts
```

### Search & Explore
```
GET    /api/search?q=query&type=all
GET    /api/explore/trending-tags
GET    /api/explore/tag/:tag       - Posts by tag
GET    /api/explore/trending-posts
GET    /api/explore/categories
```

---

## 🎯 Features

### ✅ Implemented
- [x] User authentication (JWT)
- [x] User profiles with customization
- [x] Post creation (text, images, videos, quotes)
- [x] Post engagement (likes, comments, saves, shares)
- [x] Follow/friendship system
- [x] Direct messaging with real-time updates (Socket.io)
- [x] Story/novel system with chapters
- [x] AI chatbot creation and interaction
- [x] Communities with posts and discussions
- [x] Global search (users, posts, tags, communities)
- [x] Trending content discovery
- [x] Tag-based categorization
- [x] Complete React frontend with all pages
- [x] Beautiful gradient UI with Tailwind CSS
- [x] Responsive design
- [x] Database seeding with 50+ demo posts

### 🚧 Coming Soon
- [ ] Vision board creation tool
- [ ] Advanced Studio editor (Canva-style)
- [ ] Sticker system with background removal
- [ ] Goals tracking system
- [ ] Notifications center
- [ ] User achievement badges
- [ ] Mobile app (React Native)
- [ ] AI bot responses with OpenAI integration
- [ ] Advanced analytics dashboard

---

## 🎨 Design System

### Color Palette
```
Primary: #9d4edd (Purple)
Accent: #e0aaff (Pink)
Dark: #0f0f1e (Dark Background)
Light: #f5f5f5 (Light Text)
```

### Typography
- Font: Poppins
- Weights: 300, 400, 500, 600, 700

### Components
- Gradient buttons and cards
- Smooth animations
- Responsive grid layouts
- Modal dialogs
- Toast notifications

---

## 🔐 Security

- **Authentication**: JWT tokens with 7-day expiration
- **Password Hashing**: bcryptjs with salt rounds
- **Database**: Parameterized queries to prevent SQL injection
- **CORS**: Configured for frontend domain
- **Middleware**: Auth protection on protected routes

---

## 📱 Project Structure

```
HTAPP/
├── server.js                 # Main server file
├── package.json             # Backend dependencies
├── .env.example             # Environment template
├── database/
│   └── schema.sql           # Database schema
├── middleware/
│   └── auth.js              # JWT authentication
├── routes/
│   ├── auth.js              # Authentication routes
│   ├── users.js             # User profile routes
│   ├── posts.js             # Post management routes
│   ├── comments.js          # Comment routes
│   ├── likes.js             # Engagement routes
│   ├── follows.js           # Follow routes
│   ├── friends.js           # Friend routes
│   ├── messages.js          # Messaging routes
│   ├── stories.js           # Story routes
│   ├── bots.js              # AI bot routes
│   ├── communities.js       # Community routes
│   ├── search.js            # Search routes
│   └── explore.js           # Explore routes
├── scripts/
│   └── seedDatabase.js      # Database seeding
├── client/                  # React frontend
│   ├── package.json
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── index.js
│   │   ├── App.js
│   │   ├── index.css
│   │   ├── api/
│   │   │   ├── api.js
│   │   │   └── endpoints.js
│   │   ├── redux/
│   │   │   ├── store.js
│   │   │   └── slices/
│   │   │       ├── authSlice.js
│   │   │       └── postSlice.js
│   │   ├── pages/
│   │   │   ├── HomePage.js
│   │   │   ├── ProfilePage.js
│   │   │   ├── PostPage.js
│   │   │   ├── SearchPage.js
│   │   │   ├── ExplorePage.js
│   │   │   ├── AuthPage.js
│   │   │   ├── StoryPage.js
│   │   │   ├── BotPage.js
│   │   │   ├── CommunityPage.js
│   │   │   └── MessagesPage.js
│   │   └── components/
│   │       ├── Navbar.js
│   │       ├── Sidebar.js
│   │       ├── PostCard.js
│   │       └── CreatePostModal.js
│   └── tailwind.config.js
└── README.md
```

---

## 🌟 Demo Seed Data

The database is seeded with:
- **1 Founder account** (tasnimh-crypto)
- **20 realistic users** with diverse profiles and interests
- **50 posts** with tags across different aesthetics
- **Follow relationships** creating a social graph
- **Likes and comments** showing engagement
- **5 AI chatbot characters** ready to interact
- **3 communities** for group discussions
- **3 stories** with multiple chapters

---

## 🔮 Future Roadmap

### Phase 2: Advanced Creation Tools
- Vision board editor with drag-drop
- Canva-like Studio editor
- Sticker system with background removal
- Advanced image editing

### Phase 3: Enhanced Social
- Stories (24-hour disappearing posts)
- Live streaming
- Group video calls
- Social challenges

### Phase 4: AI Integration
- GPT-powered bot responses
- Personalized content recommendations
- Smart search
- Content moderation

### Phase 5: Monetization
- Premium features
- Creator marketplace
- Sponsored content
- Affiliate programs

---

## 📝 License

MIT License - Built with ❤️ by Tasnim H

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

## 📧 Support

For issues, questions, or suggestions, please open an issue on GitHub.

---

**Status**: 🚀 **Ready for Launch**

All core features implemented and tested. Database seeding includes 50+ demo posts, 20 users, and all major features working end-to-end.
