const adminDetails = require('./models/details/admin-details.model');
const connectToMongo = require('./database/db');
const mongoose = require('mongoose');
const logger = require('../utils/logger');

const seedData = async () => {
  try {
    await connectToMongo();

    // Clear existing admin data
    await adminDetails.deleteMany({});

    const password = 'admin123';
    const employeeId = 123456;

    const adminDetail = {
      employeeId: employeeId,
      firstName: 'Sundar',
      middleName: 'R',
      lastName: 'Pichai',
      email: 'admin@gmail.com',
      phone: '1234567890',
      profile: 'Faculty_Profile_123456.jpg',
      address: '123 College Street',
      city: 'College City',
      state: 'State',
      pincode: '123456',
      country: 'India',
      gender: 'male',
      dob: new Date('1990-01-01'),
      designation: 'System Administrator',
      joiningDate: new Date(),
      salary: 50000,
      status: 'active',
      isSuperAdmin: true,
      emergencyContact: {
        name: 'Emergency Contact',
        relationship: 'Spouse',
        phone: '9876543210',
      },
      bloodGroup: 'O+',
      password: password,
    };

    await adminDetails.create(adminDetail);

    logger.info('\n=== Admin Credentials ===');
    logger.info('Employee ID:', employeeId);
    logger.info('Password:', password);
    logger.info('Email:', adminDetail.email);
    logger.info('=======================\n');
    logger.info('Seeding completed successfully!');
  } catch (error) {
    logger.warn('Error while seeding:', error);
  } finally {
    await mongoose.connection.close();
    process.exit();
  }
};

seedData();
