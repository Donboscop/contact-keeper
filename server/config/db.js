const mongoose = require('mongoose');

const connectDB = async () => {
  console.log(`[DEBUG] MONGO_URI env var is: ${process.env.MONGO_URI ? 'PRESENT (starts with ' + process.env.MONGO_URI.substring(0, 15) + ')' : 'MISSING / UNDEFINED'}`);
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/contact-keeper');
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    console.warn('WARNING: Running server without database connection. API requests will fail until database is connected.');
  }
};

module.exports = connectDB;
