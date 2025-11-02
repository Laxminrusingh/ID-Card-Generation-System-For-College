const mongoose = require('mongoose');
const Gazetted = require('../models/Gazetted');
const NonGazetted = require('../models/NonGazetted');
require('dotenv').config();

const addSampleData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Sample Student Data
    const sampleStudent = new NonGazetted({
      applicationId: 'STU-' + Date.now().toString().slice(-8) + '01',
      name: 'John Doe',
      registrationNo: 'REG2024001',
      dob: '2000-01-15',
      gender: 'Male',
      bloodGroup: 'O+',
      course: 'B.Tech',
      department: 'CSE',
      year: '3rd Year',
      section: 'A',
      phone: '9876543210',
      email: 'john.doe@student.giet.edu',
      address: '123 Student Street, City',
      guardianName: 'Mr. Doe Senior',
      guardianContact: '9876543211',
      status: 'Pending'
    });

    // Sample Faculty Data
    const sampleFaculty = new Gazetted({
      applicationId: 'FAC-' + Date.now().toString().slice(-8) + '01',
      name: 'Dr. Jane Smith',
      designation: 'Assistant Professor',
      department: 'Computer Science',
      employeeId: 'EMP2024001',
      dateOfJoining: '2020-07-01',
      qualification: 'Ph.D in Computer Science',
      email: 'jane.smith@giet.edu',
      contactNumber: '9876543212',
      address: '456 Faculty Colony, City',
      bloodGroup: 'A+',
      emergencyContactName: 'Mr. Smith',
      emergencyContactNumber: '9876543213',
      status: 'Pending'
    });

    await sampleStudent.save();
    await sampleFaculty.save();

    console.log('Sample data added successfully!');
    console.log('Student Application ID:', sampleStudent.applicationId);
    console.log('Faculty Application ID:', sampleFaculty.applicationId);
    
  } catch (error) {
    console.error('Error adding sample data:', error);
  } finally {
    mongoose.connection.close();
  }
};

addSampleData();