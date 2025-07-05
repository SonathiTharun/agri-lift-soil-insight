const mongoose = require('mongoose');
require('dotenv').config();

// Import models
const { ProductCategory } = require('./src/models/Product');

async function seedCategories() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Check if categories already exist
    const existingCategories = await ProductCategory.find();
    if (existingCategories.length > 0) {
      console.log(`✅ Found ${existingCategories.length} existing categories:`);
      existingCategories.forEach(cat => {
        console.log(`   - ${cat.name} (ID: ${cat._id})`);
      });
      return;
    }

    // Create default categories
    const categories = [
      {
        name: 'Fertilizers',
        description: 'NPK, Organic, and Liquid fertilizers for crop nutrition',
        icon: '🌱',
        image: '/images/categories/fertilizers.jpg',
        isActive: true,
        sortOrder: 1
      },
      {
        name: 'Pesticides',
        description: 'Insecticides, Herbicides, and Fungicides for crop protection',
        icon: '🐛',
        image: '/images/categories/pesticides.jpg',
        isActive: true,
        sortOrder: 2
      },
      {
        name: 'Seeds',
        description: 'High-quality crop seeds, saplings, and plant varieties',
        icon: '🌾',
        image: '/images/categories/seeds.jpg',
        isActive: true,
        sortOrder: 3
      },
      {
        name: 'Farm Tools',
        description: 'Hand tools, equipment, and farming implements',
        icon: '🔧',
        image: '/images/categories/tools.jpg',
        isActive: true,
        sortOrder: 4
      },
      {
        name: 'Irrigation',
        description: 'Drip systems, sprinklers, pipes, and water management',
        icon: '💧',
        image: '/images/categories/irrigation.jpg',
        isActive: true,
        sortOrder: 5
      },
      {
        name: 'Machinery',
        description: 'Tractors, harvesters, tillers, and heavy equipment',
        icon: '🚜',
        image: '/images/categories/machinery.jpg',
        isActive: true,
        sortOrder: 6
      },
      {
        name: 'Organic Products',
        description: 'Bio-fertilizers, organic pesticides, and natural solutions',
        icon: '🍃',
        image: '/images/categories/organic.jpg',
        isActive: true,
        sortOrder: 7
      },
      {
        name: 'Livestock',
        description: 'Animal feed, veterinary supplies, and livestock products',
        icon: '🐄',
        image: '/images/categories/livestock.jpg',
        isActive: true,
        sortOrder: 8
      }
    ];

    // Insert categories
    const createdCategories = await ProductCategory.insertMany(categories);
    
    console.log('✅ Categories created successfully!');
    console.log('\n📋 Available Categories:');
    createdCategories.forEach(cat => {
      console.log(`   ${cat.icon} ${cat.name} (ID: ${cat._id})`);
    });

    console.log('\n🎯 You can now use these category IDs when creating products!');

  } catch (error) {
    console.error('❌ Error seeding categories:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

seedCategories();
