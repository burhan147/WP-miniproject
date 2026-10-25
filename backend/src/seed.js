const dns = require('dns');
dns.setServers(['8.8.8.8', '1.1.1.1']);

const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const User = require('./models/User');
const Committee = require('./models/Committee');
const Event = require('./models/Event');
const FeedPost = require('./models/FeedPost');
const Review = require('./models/Review');
const LostFound = require('./models/LostFound');

const seedData = async () => {
  try {
    console.log('Connecting to MongoDB Atlas (with Google DNS)...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected! Clearing old collections...');

    await Promise.all([
      User.deleteMany({}),
      Committee.deleteMany({}),
      Event.deleteMany({}),
      FeedPost.deleteMany({}),
      Review.deleteMany({}),
      LostFound.deleteMany({})
    ]);

    console.log('Creating Users...');
    const hashedAdminPassword = await bcrypt.hash('admin123', 10);
    const hashedStudentPassword = await bcrypt.hash('student123', 10);

    const admin = await User.create({
      name: 'Admin Coordinator',
      email: 'admin@peerly.edu',
      password: hashedAdminPassword,
      department: 'Dean of Student Affairs',
      role: 'ADMIN'
    });

    const student = await User.create({
      name: 'Aaditya Joshi',
      email: 'student@peerly.edu',
      password: hashedStudentPassword,
      department: 'Computer Science',
      year: "Class of '27",
      role: 'STUDENT'
    });

    console.log('Creating Committees...');
    const committees = await Committee.create([
      {
        name: 'Circuit Society',
        category: 'Technical',
        description: 'Robotics, drones and embedded hardware systems.',
        lead: 'Vikramaditya S. (President)',
        contact_email: 'circuits@peerly.edu',
        website: 'https://example.com/circuitsociety',
        departments: ['Robotics', 'Embedded Systems', 'Drones & UAV', 'Sponsorship & Outreach'],
        rating: 4.8,
        reviews_count: 24,
        members: 148,
        logo_url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=600',
        is_recruiting: true
      },
      {
        name: 'Masquerade',
        category: 'Cultural',
        description: 'The campus theatre collective for stage and street play.',
        lead: 'Rhea Kapoor (Creative Director)',
        contact_email: 'masquerade@peerly.edu',
        website: 'https://example.com/masquerade',
        departments: ['Nukkad Natak', 'Stage Play', 'Scriptwriting', 'Set & Props Design'],
        rating: 4.6,
        reviews_count: 18,
        members: 92,
        logo_url: 'https://images.unsplash.com/photo-1469488865564-c2de10f69f96?auto=format&fit=crop&q=80&w=600',
        is_recruiting: true
      },
      {
        name: 'Aperture',
        category: 'Media',
        description: 'Visual storytelling, photography, cinematics & films.',
        lead: 'Karan Joshi (Head of Media)',
        contact_email: 'aperture@peerly.edu',
        website: 'https://example.com/aperture',
        departments: ['Still Photography', 'Cinematography', 'Post-Production', 'Event Coverage'],
        rating: 4.4,
        reviews_count: 12,
        members: 64,
        logo_url: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=600',
        is_recruiting: false
      }
    ]);

    console.log('Creating Events...');
    const now = new Date();
    const eventDates = [
      new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 18, 0),
      new Date(now.getFullYear(), now.getMonth(), now.getDate() + 3, 19, 30),
      new Date(now.getFullYear(), now.getMonth(), now.getDate() + 5, 6, 30),
      new Date(now.getFullYear(), now.getMonth(), now.getDate() + 8, 9, 0)
    ];

    await Event.create([
      {
        committee_id: committees[0]._id,
        title: 'Build Night: Autonomous Line Followers',
        category: 'Workshop',
        start_time: eventDates[0],
        end_time: new Date(eventDates[0].getTime() + 2 * 60 * 60 * 1000),
        location: 'Hardware Lab C, Block 3',
        description: 'Hands-on session building Arduino-based line following bots.',
        reg_link: 'https://peerly.edu/register/bot101',
        going_count: 64,
        is_recruiting: true
      },
      {
        committee_id: committees[1]._id,
        title: 'Open Mic — Acoustic & Monsoon Monologues',
        category: 'Cultural',
        start_time: eventDates[1],
        end_time: new Date(eventDates[1].getTime() + 3 * 60 * 60 * 1000),
        location: 'Central Amphitheatre',
        description: 'Showcase your poetry, music, and stage storytelling under the stars.',
        reg_link: 'https://peerly.edu/register/openmic',
        going_count: 210,
        is_recruiting: false
      },
      {
        committee_id: committees[2]._id,
        title: 'Film Walk: Historic Campus Quarter',
        category: 'Social',
        start_time: eventDates[2],
        end_time: new Date(eventDates[2].getTime() + 2 * 60 * 60 * 1000),
        location: 'North Gate Fountain',
        description: 'Morning golden hour cinematography and architectural photography walk.',
        reg_link: 'https://peerly.edu/register/filmwalk',
        going_count: 41,
        is_recruiting: false
      },
      {
        committee_id: committees[0]._id,
        title: 'Hack the Campus — 36h Prototype Sprint',
        category: 'Tech',
        start_time: eventDates[3],
        end_time: new Date(eventDates[3].getTime() + 36 * 60 * 60 * 1000),
        location: 'Innovation & Incubation Hall',
        description: 'Our annual 36-hour hackathon tackling smart campus challenges.',
        reg_link: 'https://peerly.edu/register/hack36',
        going_count: 480,
        is_recruiting: true
      }
    ]);

    console.log('Creating Feed Posts...');
    await FeedPost.create([
      {
        author_id: admin._id,
        committee_name: 'Circuit Society',
        media_type: 'image',
        media_url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=1000',
        caption: 'Build night #41. Four teams, one working quadcopter, zero fire alarms. Recruitment desk opens Monday outside the central canteen!',
        badge: 'Recruiting',
        likes: 142,
        comments: [
          { author_id: student._id, user: 'Aaditya J.', comment: 'Is the workshop open for 1st year students?', createdAt: new Date() },
          { author_id: admin._id, user: 'Circuit Society', comment: 'Yes! All branches and years welcome.', createdAt: new Date() }
        ]
      },
      {
        author_id: admin._id,
        committee_name: 'Aperture',
        media_type: 'video',
        media_url: 'https://assets.mixkit.co/videos/preview/mixkit-drone-view-of-a-campus-41539-large.mp4',
        poster_url: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=1000',
        caption: 'Golden hour at the main quad. Teaser reel for our upcoming monsoon photowalk.',
        badge: 'Featured Video',
        likes: 89,
        comments: [
          { author_id: student._id, user: 'Dev R.', comment: 'The grading on this drone footage is crazy good!', createdAt: new Date() }
        ]
      }
    ]);

    console.log('Creating Lost & Found Notices...');
    await LostFound.create([
      {
        type: 'FOUND',
        title: 'Black Sony Wireless Earphones with Case',
        description: 'Found under row 4 seats after the keynote session in Innovation Hall.',
        category: 'Electronics',
        location: 'Innovation Hall, Row 4',
        contact: 'Security Desk / Dean Office',
        status: 'OPEN'
      },
      {
        type: 'LOST',
        title: 'Engraved Stainless Steel Water Bottle',
        description: 'Dented near base with a brass compass keychain attached.',
        category: 'Personal Belongings',
        location: 'Amphitheatre Steps',
        contact: 'Reeva K. (CS 2nd Year)',
        status: 'OPEN'
      }
    ]);

    console.log('Creating Reviews...');
    await Review.create([
      {
        committee_id: committees[0]._id,
        user_id_hash: 'anon_demo_hash_1',
        ratings: { score: 5 },
        comment: 'Incredible hands-on learning. Built my first drone here with senior guidance.'
      },
      {
        committee_id: committees[1]._id,
        user_id_hash: 'anon_demo_hash_2',
        ratings: { score: 4.5 },
        comment: 'Great stage environment! Rehearsals get intense before fest season, but super rewarding.'
      }
    ]);

    console.log('✨ Peerly MongoDB Atlas Database seeded successfully!');
    console.log('========================================================');
    console.log('Student credentials: student@peerly.edu / student123');
    console.log('Admin credentials:   admin@peerly.edu   / admin123');
    console.log('========================================================');

    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seedData();
