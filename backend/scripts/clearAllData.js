const mongoose = require('mongoose');
const Gazetted = require('../models/Gazetted');
const NonGazetted = require('../models/NonGazetted');
require('dotenv').config();

const clearAllData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Delete all gazetted applications
    const gazettedResult = await Gazetted.deleteMany({});
    console.log(`Deleted ${gazettedResult.deletedCount} faculty applications`);

    // Delete all non-gazetted applications
    const ngResult = await NonGazetted.deleteMany({});
    console.log(`Deleted ${ngResult.deletedCount} student applications`);

    console.log('All application data cleared successfully!');
    
  } catch (error) {
    console.error('Error clearing data:', error);
  } finally {
    mongoose.connection.close();
  }
};

clearAllData();