#!/usr/bin/env node

const mongoose = require('mongoose');
require('dotenv').config();

console.log('🔍 Testing MongoDB Connection...\n');

const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error('❌ MONGODB_URI environment variable not found!');
  console.log('Please set your MongoDB connection string in the .env file');
  process.exit(1);
}

console.log('📍 Connection URI:', uri.replace(/\/\/.*@/, '//***:***@'));
console.log('⏳ Connecting...\n');

mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
})
.then(async () => {
  console.log('✅ MongoDB connected successfully!');

  // Test basic operations
  const db = mongoose.connection.db;
  const collections = await db.collections();
  console.log(`📊 Database: ${db.databaseName}`);
  console.log(`📁 Collections found: ${collections.length}`);

  await mongoose.connection.close();
  console.log('🔌 Connection closed');
  console.log('\n🎉 Ready for deployment!');
})
.catch(err => {
  console.error('❌ MongoDB connection failed:');
  console.error('Error:', err.message);

  if (err.message.includes('authentication failed')) {
    console.log('\n💡 Check your username and password in the connection string');
  } else if (err.message.includes('getaddrinfo ENOTFOUND')) {
    console.log('\n💡 Check your cluster URL in the connection string');
  } else if (err.message.includes('connection timed out')) {
    console.log('\n💡 Check your network connection and MongoDB Atlas IP whitelist');
  }

  process.exit(1);
});