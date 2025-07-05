const mongoose = require('mongoose');
const { seedBuyers } = require('../src/seeders/dairyMarketplaceSeed');

// Load environment variables
require('dotenv').config();

async function runSeed() {
  try {
    // Connect to MongoDB
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/agri-lift-soil-insight';
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');

    // Run the seeder
    await seedBuyers();

    console.log('Seeding completed successfully');
  } catch (error) {
    console.error('Seeding failed:', error);
  } finally {
    // Close the connection
    await mongoose.connection.close();
    console.log('Database connection closed');
    process.exit(0);
  }
}

runSeed();
