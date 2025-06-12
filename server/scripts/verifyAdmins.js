require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

async function verifyAdmins() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');

    // Find all admin users
    const admins = await User.find({ role: 'admin' })
      .select('email verificationCode role isVerified')
      .lean();

    console.log(`Found ${admins.length} admin users:`);
    if (admins.length === 0) {
      console.log('No admin users found.');
    } else {
      console.log('Admin users:');
      admins.forEach(admin => {
        console.log('-------------------');
        console.log(`Email: ${admin.email || 'Not set'}`);
        console.log(`Verification Code: ${admin.verificationCode || 'Not set'}`);
        console.log(`Role: ${admin.role || 'player'}`);
        console.log(`Is Verified: ${admin.isVerified || false}`);
      });
    }

    process.exit(0);
  } catch (error) {
    console.error('Error verifying admins:', error);
    process.exit(1);
  }
}

verifyAdmins();
