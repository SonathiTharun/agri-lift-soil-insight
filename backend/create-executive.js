const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import User model
const User = require('./src/models/User');

async function createExecutiveUser() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Check if executive already exists
    const existingExecutive = await User.findOne({ 
      email: 'executive@agrilift.com',
      role: 'executive' 
    });

    if (existingExecutive) {
      console.log('Executive user already exists!');
      console.log('Email: executive@agrilift.com');
      console.log('Password: Executive123!');
      process.exit(0);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash('Executive123!', 12);

    // Create executive user
    const executiveUser = new User({
      name: 'Executive Admin',
      email: 'executive@agrilift.com',
      password: hashedPassword,
      phone: '+1234567890',
      role: 'executive',
      isVerified: true,
      executiveDetails: {
        department: 'Administration',
        position: 'System Administrator',
        permissions: ['all'],
        employeeId: 'EXE001'
      },
      createdAt: new Date(),
      updatedAt: new Date()
    });

    await executiveUser.save();

    console.log('✅ Executive user created successfully!');
    console.log('📧 Email: executive@agrilift.com');
    console.log('🔑 Password: Executive123!');
    console.log('🎯 Role: executive');
    console.log('');
    console.log('🚀 Now you can login and access the Executive Portal at:');
    console.log('   http://localhost:8091/executive-portal');

  } catch (error) {
    console.error('❌ Error creating executive user:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

createExecutiveUser();
