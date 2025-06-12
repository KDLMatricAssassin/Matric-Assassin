require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

async function countUsers() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');

    const count = await User.countDocuments({});
    console.log(`Total users in database: ${count}`);

    // Get a sample of users
    const sampleUsers = await User.find({}).limit(5).select('name email code target');
    console.log('Sample users:', JSON.stringify(sampleUsers, null, 2));

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

countUsers();
