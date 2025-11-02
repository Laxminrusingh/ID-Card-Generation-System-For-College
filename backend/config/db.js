const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      maxPoolSize: 20,
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    });
    // Enable slow query logging
    mongoose.set('debug', function (coll, method, query, doc, options) {
      const start = Date.now();
      return function (err, res) {
        const duration = Date.now() - start;
        if (duration > 500) {
          console.log(`[SLOW QUERY] ${coll}.${method} (${duration}ms):`, query, doc);
        }
      };
    });
    console.log('MongoDB Connected');
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
