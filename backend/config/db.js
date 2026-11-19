const mongoose = require('mongoose');

let mongodInstance = null;

const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  if (uri && !uri.includes('localhost') && !uri.includes('127.0.0.1')) {
    try {
      const conn = await mongoose.connect(uri);
      console.log(`✅ MongoDB Connected to remote/atlas: ${conn.connection.host}`);
      return conn;
    } catch (err) {
      console.error(`⚠️ Failed to connect to configured MONGODB_URI: ${err.message}`);
    }
  }

  // Attempt local MongoDB connection first
  if (uri) {
    try {
      const conn = await mongoose.connect(uri, { serverSelectionTimeoutMS: 2500 });
      console.log(`✅ MongoDB Connected to local instance: ${conn.connection.host}`);
      return conn;
    } catch (err) {
      console.log(`ℹ️ Local MongoDB service not active (${err.message}). Starting embedded high-performance MongoDB instance...`);
    }
  }

  // Spin up MongoMemoryServer for seamless zero-setup execution
  try {
    const { MongoMemoryServer } = require('mongodb-memory-server');
    mongodInstance = await MongoMemoryServer.create();
    const memoryUri = mongodInstance.getUri();
    const conn = await mongoose.connect(memoryUri);
    console.log(`✅ CareFlow embedded MongoDB initialized at: ${memoryUri}`);
    return conn;
  } catch (error) {
    console.error(`❌ MongoDB initialization error: ${error.message}`);
    process.exit(1);
  }
};

const closeDB = async () => {
  await mongoose.disconnect();
  if (mongodInstance) {
    await mongodInstance.stop();
  }
};

module.exports = { connectDB, closeDB };
