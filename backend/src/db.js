const { MongoClient } = require('mongodb');

let db;

async function connectDB() {
  const mongoUrl = process.env.MONGO_URL || 'mongodb://mongo:27017/chemdb';
  const client = new MongoClient(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
  try {
    await client.connect();
    db = client.db('chemdb');
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Failed to connect to MongoDB', error);
    process.exit(1);
  }
}

module.exports = { connectDB, getDB: () => db };