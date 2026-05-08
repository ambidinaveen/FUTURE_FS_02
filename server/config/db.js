const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let memoryServer;

const connectDB = async () => {
  mongoose.set('strictQuery', true);

  if (process.env.MONGODB_URI) {
    try {
      await mongoose.connect(process.env.MONGODB_URI);
      console.log('MongoDB connected');
      return;
    } catch (error) {
      console.warn('Primary MongoDB connection failed, falling back to in-memory MongoDB');
    }
  }

  memoryServer = await MongoMemoryServer.create();
  const memoryUri = memoryServer.getUri('mini-crm');
  await mongoose.connect(memoryUri);
  console.log('In-memory MongoDB connected');
};

module.exports = connectDB;
