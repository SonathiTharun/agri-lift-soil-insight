const { MongoMemoryServer } = require('mongodb-memory-server');

module.exports = async () => {
  // Start in-memory MongoDB instance for testing
  const mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();
  
  // Store the instance and URI for use in tests
  global.__MONGOD__ = mongod;
  process.env.MONGODB_URI = uri;
  
  console.log('MongoDB Memory Server started at:', uri);
};
