const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
require('dotenv').config();

const createDefaultAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/railway-icard');
    console.log('Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ username: 'admin' });
    if (existingAdmin) {
      console.log('Default admin already exists');
      process.exit(0);
    }

    // Create default admin
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const defaultAdmin = new User({
      username: 'admin',
      password: hashedPassword,
      email: 'admin@railway.com',
      name: 'System Administrator',
      rlNo: 'ADMIN001',
      role: 'admin'
    });

    await defaultAdmin.save();
    console.log('Default admin created successfully!');
    console.log('Username: admin');
    console.log('Password: admin123');
    
  } catch (error) {
    console.error('Error creating default admin:', error);
  } finally {
    mongoose.connection.close();
  }
};

createDefaultAdmin();