const { pool } = require('../server');
const bcrypt = require('bcryptjs');

const seedDatabase = async () => {
  try {
    console.log('🌱 Starting comprehensive database seeding...');

    // Clear existing data
    await pool.query('DELETE FROM users');

    // Create founder account
    const founderPassword = await bcrypt.hash('founder123', 10);
    const founderResult = await pool.query(
      'INSERT INTO users (username, email, password, display_name, bio, country, city, is_founder) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id',
      ['tasnimh-crypto', 'founder@htapp.com', founderPassword, 'Tasnim H', 'Founder of HTAPP', 'Bangladesh', 'Dhaka', true]
    );
    const founderId = founderResult.rows[0].id;
    console.log('✅ Founder account created');

    // Seed 20 realistic users
    const seedUsers = [
      { username: 'AvaDreaming', email: 'ava@htapp.com', displayName: 'Ava', bio: 'Oxford dreams. IELTS journey. Vision board enthusiast.', country: 'Bangladesh', city: 'Dhaka' },
      { username: 'LondonDiary', email: 'london@htapp.com', displayName: 'Sophie', bio: 'London photography & aesthetic moments', country: 'UK', city: 'London' },
      { username: 'DarkAcademiaGirl', email: 'darkacademia@htapp.com', displayName: 'Emma', bio: 'Study sanctuary creator. Book lover.', country: 'USA', city: 'Boston' },
      { username: 'FutureEngineer', email: 'engineer@htapp.com', displayName: 'Leo', bio: 'Coding, tech, building the future', country: 'India', city: 'Bangalore' },
      { username: 'SeoulVision', email: 'seoul@htapp.com', displayName: 'Hana', bio: 'Seoul National University dreams', country: 'South Korea', city: 'Seoul' },
      { username: 'MusicMood', email: 'music@htapp.com', displayName: 'Alex', bio: 'Spotify obsessed. Music is life.', country: 'Canada', city: 'Toronto' },
      { username: 'DreamcoreSoul', email: 'dreamcore@htapp.com', displayName: 'Luna', bio: 'Lost between dreams and reality', country: 'USA', city: 'Portland' },
      { username: 'CyberWave', email: 'cyber@htapp.com', displayName: 'Kai', bio: 'Futuristic vibes. Neon nights.', country: 'Japan', city: 'Tokyo' },
      { username: 'CottageGarden', email: 'cottage@htapp.com', displayName: 'Rose', bio: 'A quiet life with books and flowers', country: 'UK', city: 'Cornwall' },
      { username: 'VisionBoardCreator', email: 'vision@htapp.com', displayName: 'Maya', bio: 'Manifesting dreams into reality', country: 'USA', city: 'Los Angeles' },
      { username: 'StudyHub', email: 'study@htapp.com', displayName: 'Jordan', bio: 'Study motivation & productivity tips', country: 'Canada', city: 'Vancouver' },
      { username: 'TravelBugger', email: 'travel@htapp.com', displayName: 'Sam', bio: 'Exploring the world one city at a time', country: 'Australia', city: 'Sydney' },
      { username: 'CreativeMinds', email: 'creative@htapp.com', displayName: 'Zara', bio: 'Artist. Designer. Dreamer.', country: 'France', city: 'Paris' },
      { username: 'BookWorm99', email: 'books@htapp.com', displayName: 'Riley', bio: 'Fiction lover. Always reading.', country: 'USA', city: 'New York' },
      { username: 'MidnightLetters', email: 'midnight@htapp.com', displayName: 'Casey', bio: 'Writing poetry at 3 AM', country: 'USA', city: 'Seattle' },
      { username: 'GoalChaser', email: 'goals@htapp.com', displayName: 'Morgan', bio: 'Chasing dreams, one goal at a time', country: 'USA', city: 'Austin' },
      { username: 'ArtisticSoul', email: 'artist@htapp.com', displayName: 'Dakota', bio: 'Digital art & design', country: 'Germany', city: 'Berlin' },
      { username: 'TeaAndBooks', email: 'tea@htapp.com', displayName: 'Quinn', bio: 'Tea enthusiast. Book collector.', country: 'UK', city: 'Oxford' },
      { username: 'NatureHunter', email: 'nature@htapp.com', displayName: 'Skyler', bio: 'Nature photography. Outdoor adventures.', country: 'Switzerland', city: 'Zurich' },
      { username: 'DreamChaser99', email: 'dreamer@htapp.com', displayName: 'Jamie', bio: 'Life is a beautiful adventure', country: 'Spain', city: 'Barcelona' },
    ];

    const userIds = [founderId];
    for (const user of seedUsers) {
      const hashedPassword = await bcrypt.hash('password123', 10);
      const result = await pool.query(
        'INSERT INTO users (username, email, password, display_name, bio, country, city) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id',
        [user.username, user.email, hashedPassword, user.displayName, user.bio, user.country, user.city]
      );
      userIds.push(result.rows[0].id);
    }
    console.log('✅ 20 users created');

    // Add interests to users
    const interests = ['Oxford', 'Cambridge', 'Harvard', 'MIT', 'Seoul', 'Dark Academia', 'Study Motivation', 'Dreamcore', 'Poetry', 'Writing'];
    for (let i = 0; i < userIds.length; i++) {
      const userInterests = interests.slice(0, Math.floor(Math.random() * 3) + 1);
      for (const interest of userInterests) {
        await pool.query(
          'INSERT INTO user_interests (user_id, interest) VALUES ($1, $2)',
          [userIds[i], interest]
        );
      }
    }
    console.log('✅ User interests added');

    // Seed 50+ posts
    const postTopics = [
      { title: 'Oxford Dreams', content: 'A collection of Oxford University inspiration and architecture. Libraries, historic buildings, study halls, and beautiful courtyards.', tags: ['#Oxford', '#StudyAbroad', '#DreamUniversity', '#DarkAcademia'] },
      { title: 'London Through My Eyes', content: 'Aesthetic moments from London. Streets, cafes, rainy sidewalks, and underground stations.', tags: ['#London', '#CityLife', '#Aesthetic'] },
      { title: 'My Study Sanctuary', content: 'Books, coffee, candles, and libraries. Creating the perfect study environment.', tags: ['#DarkAcademia', '#StudyMotivation'] },
      { title: 'Dream Tech Career', content: 'Coding setups, software engineering inspiration, and modern workspaces.', tags: ['#Programming', '#Engineering', '#Tech'] },
      { title: 'Studying In Korea', content: 'Campus life, Korean libraries, and student aesthetic from Seoul.', tags: ['#Korea', '#StudyAbroad'] },
      { title: 'Lost Between Dreams', content: 'Dreamcore visuals, soft surreal imagery, and ethereal aesthetics.', tags: ['#Dreamcore', '#Aesthetic'] },
      { title: 'Future City', content: 'Neon streets, cyberpunk visuals, and futuristic cities.', tags: ['#Cybercore', '#Cyberpunk'] },
      { title: 'A Quiet Life', content: 'Flowers, countryside, and cottagecore visuals.', tags: ['#Cottagecore', '#Nature'] },
      { title: 'My 2030 Vision Board', content: 'University goals, business goals, travel aspirations, and lifestyle dreams.', tags: ['#VisionBoard', '#Goals', '#DreamLife'] },
      { title: 'IELTS Journey', content: 'Study tips, preparation strategies, and success stories.', tags: ['#IELTS', '#EnglishLearning', '#ExamPrep'] },
    ];

    for (let i = 0; i < 50; i++) {
      const topic = postTopics[i % postTopics.length];
      const userId = userIds[Math.floor(Math.random() * userIds.length)];
      
      const result = await pool.query(
        'INSERT INTO posts (user_id, title, content, post_type, is_public) VALUES ($1, $2, $3, $4, $5) RETURNING id',
        [userId, topic.title, topic.content, 'text', true]
      );

      const postId = result.rows[0].id;
      for (const tag of topic.tags) {
        await pool.query(
          'INSERT INTO post_tags (post_id, tag) VALUES ($1, $2)',
          [postId, tag]
        );
      }
    }
    console.log('✅ 50 posts created with tags');

    // Create follow relationships
    for (let i = 0; i < userIds.length - 1; i++) {
      const followCount = Math.floor(Math.random() * 5) + 1;
      for (let j = 0; j < followCount; j++) {
        const followingId = userIds[Math.floor(Math.random() * userIds.length)];
        if (followingId !== userIds[i]) {
          try {
            await pool.query(
              'INSERT INTO follows (follower_id, following_id) VALUES ($1, $2)',
              [userIds[i], followingId]
            );
          } catch (e) {
            // Duplicate follow, skip
          }
        }
      }
    }
    console.log('✅ Follow relationships created');

    // Add likes to posts
    const postsResult = await pool.query('SELECT id FROM posts');
    const postIds = postsResult.rows.map(p => p.id);
    
    for (const postId of postIds) {
      const likeCount = Math.floor(Math.random() * 20) + 1;
      for (let i = 0; i < likeCount; i++) {
        const userId = userIds[Math.floor(Math.random() * userIds.length)];
        try {
          await pool.query(
            'INSERT INTO likes (user_id, post_id, reaction_type) VALUES ($1, $2, $3)',
            [userId, postId, 'love']
          );
        } catch (e) {
          // Duplicate like, skip
        }
      }
    }
    console.log('✅ Likes added to posts');

    // Create comments
    const commentExamples = [
      'This is inspiring! 💫',
      'Love this so much!',
      'Saving this for later 📌',
      'This changed my perspective',
      'Oxford is my dream too 🎓',
      'Beautiful content!',
      'Needed to see this today',
      'Following for more!',
      'This is exactly what I needed',
      'Your aesthetic is immaculate',
    ];

    for (const postId of postIds.slice(0, 30)) {
      const commentCount = Math.floor(Math.random() * 5) + 1;
      for (let i = 0; i < commentCount; i++) {
        const userId = userIds[Math.floor(Math.random() * userIds.length)];
        const content = commentExamples[Math.floor(Math.random() * commentExamples.length)];
        try {
          await pool.query(
            'INSERT INTO comments (post_id, user_id, content) VALUES ($1, $2, $3)',
            [postId, userId, content]
          );
        } catch (e) {
          // Skip on error
        }
      }
    }
    console.log('✅ Comments added');

    // Create 5 AI bots
    const bots = [
      { name: 'John Jungkook', title: 'Protective Idol Boyfriend', description: 'A caring and supportive idol who loves deep conversations.', greeting: 'Hey. I\'ve been waiting for you.' },
      { name: 'Gojo Satoru', title: 'The Strongest Sorcerer', description: 'Confident, playful and powerful.', greeting: 'Yo. Missed me?' },
      { name: 'CEO Husband', title: 'Cold Billionaire CEO', description: 'A successful CEO who secretly cares deeply about you.', greeting: 'You\'re late.' },
      { name: 'Study Buddy', title: 'Your Personal Tutor', description: 'A smart and encouraging study partner.', greeting: 'Ready to ace those exams?' },
      { name: 'Dream Journal', title: 'Your Dream Companion', description: 'Listen to your dreams and help you manifest them.', greeting: 'Tell me about your dreams...' },
    ];

    for (const bot of bots) {
      await pool.query(
        'INSERT INTO ai_bots (user_id, name, title, description, greeting_message, is_public) VALUES ($1, $2, $3, $4, $5, $6)',
        [founderId, bot.name, bot.title, bot.description, bot.greeting, true]
      );
    }
    console.log('✅ 5 AI bots created');

    // Create 3 communities
    const communities = [
      { name: 'Dark Academia', description: 'For those who love libraries, books, and moody aesthetics' },
      { name: 'Study Abroad Dreams', description: 'Share your study abroad journey and aspirations' },
      { name: 'Vision Board Creators', description: 'Create and share your vision boards for the future' },
    ];

    for (const community of communities) {
      await pool.query(
        'INSERT INTO communities (owner_id, name, description, is_public) VALUES ($1, $2, $3, $4)',
        [founderId, community.name, community.description, true]
      );
    }
    console.log('✅ 3 communities created');

    // Create stories
    const storyTitles = [
      'The Oxford Chronicles',
      'Letters from Seoul',
      'Midnight Dreams',
    ];

    for (const title of storyTitles) {
      const storyResult = await pool.query(
        'INSERT INTO stories (user_id, title, description, is_public, status) VALUES ($1, $2, $3, $4, $5) RETURNING id',
        [userIds[Math.floor(Math.random() * userIds.length)], title, `A story about ${title.toLowerCase()}`, true, 'published']
      );

      const storyId = storyResult.rows[0].id;

      // Add 3 chapters to each story
      for (let i = 1; i <= 3; i++) {
        await pool.query(
          'INSERT INTO story_chapters (story_id, chapter_number, title, content) VALUES ($1, $2, $3, $4)',
          [storyId, i, `Chapter ${i}`, `This is chapter ${i} of the story. It contains an interesting narrative about dreams and aspirations.`]
        );
      }
    }
    console.log('✅ 3 stories with chapters created');

    console.log('\n🎉 Database seeding completed successfully!');
    console.log('📊 Summary:');
    console.log(`   - 1 Founder account`);
    console.log(`   - 20 Regular users`);
    console.log(`   - 50 Posts with tags`);
    console.log(`   - Follow relationships`);
    console.log(`   - Likes and comments`);
    console.log(`   - 5 AI bots`);
    console.log(`   - 3 Communities`);
    console.log(`   - 3 Stories with chapters`);
    console.log('\n🚀 Ready to launch!');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

seedDatabase();
