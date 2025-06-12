require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

// Admin data
const admins = [
  { email: 'ethanatie.1@gmail.com', code: 'ETHAN2025' },
  { email: 'gadic@sabje.co.za', code: 'GADI2025' },
  { email: 'tanalyons21@gmail.com', code: 'TANA2025' },
  { email: 'yotam.limor1@gmail.com', code: 'YOTAM2025' },
  { email: 'stochtevin@gmail.com', code: 'TEVIN2025' },
];

async function updateAdmins() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');

    // Process each admin
    for (const admin of admins) {
      const { email, code } = admin;
      const hashedPassword = await bcrypt.hash(code, 10);
      
      // Try to find and update existing admin, or create new one
      const updatedAdmin = await User.findOneAndUpdate(
        { email },
        {
          $set: {
            email: email.toLowerCase(),
            password: hashedPassword,
            verificationCode: code,
            role: 'admin',
            isVerified: true
          }
        },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
      
      console.log(`Processed admin: ${updatedAdmin.name} (${updatedAdmin.email})`);
    }

    console.log('Admin update completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error updating admins:', error);
    process.exit(1);
  }
}

updateAdmins();
