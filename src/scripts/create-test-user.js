const mongoose = require('mongoose');
require('dotenv').config();

async function createTestUser() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to database');

    const User = mongoose.model('User', new mongoose.Schema({
      name: { type: String, required: true },
      email: { type: String, required: true, unique: true },
      password: { type: String, required: true },
    }, {
      timestamps: true,
    }));

    // Create a test user
    const testUser = new User({
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123', // In real app, this would be hashed
    });

    await testUser.save();
    console.log('Test user created:');
    console.log(`ID: ${testUser._id}`);
    console.log(`Name: ${testUser.name}`);
    console.log(`Email: ${testUser.email}`);

    await mongoose.disconnect();
    console.log('Disconnected from database');
  } catch (error) {
    console.error('Error creating test user:', error);
    process.exit(1);
  }
}

createTestUser();
