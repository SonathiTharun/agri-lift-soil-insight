#!/usr/bin/env node

/**
 * Database Migration Script for AgriLift Soil Insight
 * 
 * This script handles database migrations for the application.
 * It ensures the database schema is up to date with the latest changes.
 */

const mongoose = require('mongoose');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/agri-lift-soil-insight';

// Migration functions
const migrations = [
  {
    version: '1.0.0',
    description: 'Initial database setup',
    up: async () => {
      console.log('Running initial database setup...');
      
      // Create indexes for better performance
      const db = mongoose.connection.db;
      
      // Users collection indexes
      await db.collection('users').createIndex({ email: 1 }, { unique: true });
      await db.collection('users').createIndex({ phoneNumber: 1 });
      await db.collection('users').createIndex({ createdAt: 1 });
      
      // Dairy marketplace indexes
      await db.collection('milkproductions').createIndex({ farmerId: 1 });
      await db.collection('milkproductions').createIndex({ createdAt: 1 });
      await db.collection('milkproductions').createIndex({ location: 1 });
      
      // Buyers collection indexes
      await db.collection('buyers').createIndex({ location: 1 });
      await db.collection('buyers').createIndex({ type: 1 });
      await db.collection('buyers').createIndex({ rating: 1 });
      
      console.log('✅ Initial database setup completed');
    }
  },
  {
    version: '1.1.0',
    description: 'Add geospatial indexes',
    up: async () => {
      console.log('Adding geospatial indexes...');
      
      const db = mongoose.connection.db;
      
      // Add geospatial indexes for location-based queries
      await db.collection('milkproductions').createIndex({ "coordinates": "2dsphere" });
      await db.collection('buyers').createIndex({ "coordinates": "2dsphere" });
      
      console.log('✅ Geospatial indexes added');
    }
  }
];

// Migration tracking schema
const migrationSchema = new mongoose.Schema({
  version: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  appliedAt: { type: Date, default: Date.now }
});

const Migration = mongoose.model('Migration', migrationSchema);

async function runMigrations() {
  try {
    console.log('🚀 Starting database migrations...');
    
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('📦 Connected to MongoDB');
    
    // Get applied migrations
    const appliedMigrations = await Migration.find({}).sort({ appliedAt: 1 });
    const appliedVersions = appliedMigrations.map(m => m.version);
    
    console.log(`📋 Found ${appliedMigrations.length} applied migrations`);
    
    // Run pending migrations
    let migrationsRun = 0;
    
    for (const migration of migrations) {
      if (!appliedVersions.includes(migration.version)) {
        console.log(`⚡ Running migration ${migration.version}: ${migration.description}`);
        
        try {
          await migration.up();
          
          // Record migration as applied
          await Migration.create({
            version: migration.version,
            description: migration.description
          });
          
          migrationsRun++;
          console.log(`✅ Migration ${migration.version} completed successfully`);
        } catch (error) {
          console.error(`❌ Migration ${migration.version} failed:`, error.message);
          throw error;
        }
      } else {
        console.log(`⏭️  Migration ${migration.version} already applied, skipping`);
      }
    }
    
    if (migrationsRun === 0) {
      console.log('✨ Database is up to date, no migrations needed');
    } else {
      console.log(`🎉 Successfully applied ${migrationsRun} migration(s)`);
    }
    
  } catch (error) {
    console.error('💥 Migration failed:', error.message);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('📦 Disconnected from MongoDB');
  }
}

// Run migrations if this script is executed directly
if (require.main === module) {
  runMigrations()
    .then(() => {
      console.log('🏁 Migration process completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Migration process failed:', error);
      process.exit(1);
    });
}

module.exports = { runMigrations, migrations };
