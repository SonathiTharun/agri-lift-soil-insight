const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./src/models/User');

// Load environment variables
require('dotenv').config();

async function createTestUsers() {
  try {
    // Connect to MongoDB
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/agri-lift-soil-insight';
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');

    // Test users data
    const testUsers = [
      {
        name: 'Test Farmer',
        email: 'farmer@test.com',
        password: 'Farmer123!',
        phone: '+919876543210',
        role: 'farmer',
        status: 'active',
        verification: 'verified',
        farmDetails: {
          farmName: 'Green Valley Farm',
          farmSize: 10,
          farmType: 'organic',
          primaryCrops: ['wheat', 'rice', 'tomato'],
          experience: 5
        },
        location: {
          address: '123 Farm Road',
          city: 'Pune',
          state: 'Maharashtra',
          country: 'India',
          coordinates: {
            latitude: 18.5204,
            longitude: 73.8567
          }
        }
      },
      {
        name: 'Executive Admin',
        email: 'executive@test.com',
        password: 'Executive123!',
        phone: '+919876543211',
        role: 'executive',
        status: 'active',
        verification: 'verified',
        executiveDetails: {
          department: 'Administration',
          position: 'System Administrator',
          employeeId: 'EXE001',
          accessLevel: 'admin'
        },
        location: {
          address: '456 Corporate Plaza',
          city: 'Mumbai',
          state: 'Maharashtra',
          country: 'India',
          coordinates: {
            latitude: 19.0760,
            longitude: 72.8777
          }
        }
      },
      {
        name: 'Demo Farmer',
        email: 'demo@farmer.com',
        password: 'Demo123!',
        phone: '+919876543212',
        role: 'farmer',
        status: 'active',
        verification: 'verified',
        farmDetails: {
          farmName: 'Sunrise Organic Farm',
          farmSize: 25,
          farmType: 'organic',
          primaryCrops: ['cotton', 'sugarcane', 'onion'],
          experience: 12
        },
        location: {
          address: '789 Village Road',
          city: 'Nashik',
          state: 'Maharashtra',
          country: 'India',
          coordinates: {
            latitude: 19.9975,
            longitude: 73.7898
          }
        }
      }
    ];

    console.log('🌱 Creating test users...');

    for (const userData of testUsers) {
      // Check if user already exists
      const existingUser = await User.findOne({ email: userData.email });
      
      if (existingUser) {
        console.log(`⚠️  User ${userData.email} already exists, skipping...`);
        continue;
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(userData.password, 12);
      
      // Create user
      const user = new User({
        ...userData,
        password: hashedPassword
      });

      await user.save();
      console.log(`✅ Created ${userData.role}: ${userData.email}`);
    }

    console.log('\n🎉 Test users created successfully!');
    console.log('\n📋 Login Credentials:');
    console.log('┌─────────────────────────────────────────────────────────┐');
    console.log('│                    FARMER ACCOUNTS                      │');
    console.log('├─────────────────────────────────────────────────────────┤');
    console.log('│ Email: farmer@test.com                                  │');
    console.log('│ Password: Farmer123!                                    │');
    console.log('│ Role: farmer                                            │');
    console.log('├─────────────────────────────────────────────────────────┤');
    console.log('│ Email: demo@farmer.com                                  │');
    console.log('│ Password: Demo123!                                      │');
    console.log('│ Role: farmer                                            │');
    console.log('├─────────────────────────────────────────────────────────┤');
    console.log('│                   EXECUTIVE ACCOUNTS                    │');
    console.log('├─────────────────────────────────────────────────────────┤');
    console.log('│ Email: executive@test.com                               │');
    console.log('│ Password: Executive123!                                 │');
    console.log('│ Role: executive                                         │');
    console.log('└─────────────────────────────────────────────────────────┘');

  } catch (error) {
    console.error('❌ Error creating test users:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

createTestUsers();
