const adminDetails = require('./src/models/admin.model');
const connectToMongo = require('./src/database/db');
const mongoose = require('mongoose');
const logger = require('./src/utils/logger');
const cloudinary = require('cloudinary').v2;
const path = require('path');
const fs = require('fs');
require('dotenv').config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadImageToCloudinary = async (imagePath) => {
  try {
    console.log('📸 Uploading image to Cloudinary...');

    const result = await cloudinary.uploader.upload(imagePath, {
      folder: 'university-management-system',
      transformation: [
        { width: 500, height: 500, crop: 'limit', quality: 'auto', fetch_format: 'auto' }
      ],
      resource_type: 'image',
    });

    console.log('✅ Image uploaded successfully:', result.secure_url);
    return result.secure_url;
  } catch (error) {
    console.error('❌ Cloudinary upload failed:', error);
    return null;
  }
};

const seedData = async () => {
  try {
    await connectToMongo();

    // Clear existing admin data
    await adminDetails.deleteMany({});

    const password = 'admin123';
    const employeeId = 123456;

    // Upload image to Cloudinary
    // REPLACE THIS PATH with the actual path to your image file
const imagePath = path.join(__dirname, 'admin-profile.jpg');// Update this path

    let profileImageUrl = null;

    // Check if image file exists
    if (fs.existsSync(imagePath)) {
      profileImageUrl = await uploadImageToCloudinary(imagePath);
    } else {
      console.log('⚠️  Image file not found at:', imagePath);
      console.log('📁 Please place your admin profile image at:', imagePath);
      console.log('🔄 Proceeding without profile image (will show fallback initials)');
    }

    const adminDetail = {
      employeeId: employeeId,
      firstName: 'Sundar',
      middleName: 'R',
      lastName: 'Pichai',
      email: 'admin@gmail.com',
      phone: '1234567890',
      profile: profileImageUrl, // ✅ Now stores full Cloudinary URL or null
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

    logger.info('\n=== Admin Seeding Complete ===');
    logger.info('Employee ID:', employeeId);
    logger.info('Password:', password);
    logger.info('Email:', adminDetail.email);
    logger.info('Profile Image:', profileImageUrl || 'Not uploaded (will show initials)');
    logger.info('============================\n');
    logger.info('Seeding completed successfully!');
  } catch (error) {
    logger.warn('Error while seeding:', error);
  } finally {
    await mongoose.connection.close();
    process.exit();
  }
};

seedData();
