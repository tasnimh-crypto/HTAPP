const { pool } = require('../server');
const bcrypt = require('bcryptjs');

const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seeding...');

    // Seed users
    const seedUsers = [
      {
        username: 'AvaDreaming',
        email: 'ava@htapp.com',
        password: await bcrypt.hash('password123', 10),
        displayName: 'Ava',
        bio: 'Oxford dreams. IELTS journey. Vision board enthusiast.',
        country: 'Bangladesh',
        city: 'Dhaka'
      },
      {
        username: 'LondonDiary',
        email: 'london@htapp.com',
        password: await bcrypt.hash('password123', 10),
        displayName: 'Sophie',
        bio: 'London photography & aesthetic moments',
        country: 'UK',
        city: 'London'
      },
      {
        username: 'DarkAcademiaGirl',
        email: 'darkacademia@htapp.com',
        password: await bcrypt.hash('password123', 10),
        displayName: 'Emma',
        bio: 'Study sanctuary creator. Book lover.',
        country: 'USA',
        city: 'Boston'
      },
      {
        username: 'FutureEngineer',
        email: 'engineer@htapp.com',
        password: await bcrypt.hash('password123', 10),
        displayName: 'Leo',
        bio: 'Coding, tech, building the future',
        country: 'India',
        city: 'Bangalore'
      },
      {
        username: 'SeoulVision',
        email: 'seoul@htapp.com',
        password: await bcrypt.hash('password123', 10),
        displayName: 'Hana',
        bio: 'Seoul National University dreams',
        country: 'South Korea',
        city: 'Seoul'
      }
    ];

    for (const user of seedUsers) {
      await pool.query(
        'INSERT INTO users (username, email, password, display_name, bio, country, city) VALUES ($1, $2, $3, $4, $5, $6, $7)',
        [user.username, user.email, user.password, user.displayName, user.bio, user.country, user.city]
      );
    }

    console.log('✅ Users seeded');

    // Seed posts
    const seedPosts = [
      {
        userId: 1,
        title: 'Oxford Dreams',
        content: 'A collection of Oxford University inspiration and architecture. Libraries, historic buildings, study halls, and beautiful courtyards.',
        postType: 'text',
        tags: ['#Oxford', '#StudyAbroad', '#DreamUniversity', '#DarkAcademia']
      },
      {
        userId: 2,
        title: 'London Through My Eyes',
        content: 'Aesthetic moments from London. Streets, cafes, rainy sidewalks, and underground stations.',
        postType: 'text',
        tags: ['#London', '#CityLife', '#Aesthetic']
      },
      {
        userId: 3,
        title: 'My Study Sanctuary',
        content: 'Books, coffee, candles, and libraries. Creating the perfect study environment.',
        postType: 'text',
        tags: ['#DarkAcademia', '#StudyMotivation']
      }
    ];

    for (const post of seedPosts) {
      const result = await pool.query(
        'INSERT INTO posts (user_id, title, content, post_type, is_public) VALUES ($1, $2, $3, $4, $5) RETURNING id',
        [post.userId, post.title, post.content, post.postType, true]
      );

      const postId = result.rows[0].id;

      for (const tag of post.tags) {
        await pool.query(
          'INSERT INTO post_tags (post_id, tag) VALUES ($1, $2)',
          [postId, tag]
        );
      }
    }

    console.log('✅ Posts seeded');

    // Seed follows
    await pool.query(
      'INSERT INTO follows (follower_id, following_id) VALUES ($1, $2), ($2, $1), ($3, $1), ($1, $3)',
      [1, 2, 3]
    );

    console.log('✅ Follows seeded');

    console.log('🎉 Database seeding completed!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

seedDatabase();
