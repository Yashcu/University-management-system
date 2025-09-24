const mongoose = require('mongoose');
const facultyDetails = require('../src/models/faculty.model');
const adminDetails = require('../src/models/admin.model');
const studentDetails = require('../src/models/student.model');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const fixProfileImages = async () => {
  console.log('🔧 Starting profile image cleanup...');

  try {
    // Fix Faculty Records
    console.log('📋 Fixing faculty profiles...');
    const faculty = await facultyDetails.find({
      profile: { $exists: true, $ne: null, $ne: '' }
    });

    let facultyUpdated = 0;
    for (const f of faculty) {
      // If profile is just a filename (not a URL)
      if (f.profile && !f.profile.startsWith('http') && !f.profile.includes('university-management-system/')) {
        console.log(`Fixing faculty ${f.firstName} ${f.lastName}: ${f.profile}`);

        // Remove the old filename-only profile (will show fallback)
        await facultyDetails.findByIdAndUpdate(f._id, { $unset: { profile: 1 } });
        facultyUpdated++;
      }
    }
    console.log(`✅ Updated ${facultyUpdated} faculty records`);

    // Fix Admin Records
    console.log('📋 Fixing admin profiles...');
    const admins = await adminDetails.find({
      profile: { $exists: true, $ne: null, $ne: '' }
    });

    let adminsUpdated = 0;
    for (const a of admins) {
      // If profile is just a filename (not a URL)
      if (a.profile && !a.profile.startsWith('http') && !a.profile.includes('university-management-system/')) {
        console.log(`Fixing admin ${a.firstName} ${a.lastName}: ${a.profile}`);

        // Remove the old filename-only profile (will show fallback)
        await adminDetails.findByIdAndUpdate(a._id, { $unset: { profile: 1 } });
        adminsUpdated++;
      }
    }
    console.log(`✅ Updated ${adminsUpdated} admin records`);

    // Check Students (should be fine but let's verify)
    console.log('📋 Checking student profiles...');
    const students = await studentDetails.find({
      profile: { $exists: true, $ne: null, $ne: '' }
    });

    let studentsUpdated = 0;
    for (const s of students) {
      // If profile is just a filename (not a URL)
      if (s.profile && !s.profile.startsWith('http') && !s.profile.includes('university-management-system/')) {
        console.log(`Fixing student ${s.firstName} ${s.lastName}: ${s.profile}`);

        // Remove the old filename-only profile (will show fallback)
        await studentDetails.findByIdAndUpdate(s._id, { $unset: { profile: 1 } });
        studentsUpdated++;
      }
    }
    console.log(`✅ Updated ${studentsUpdated} student records`);

    console.log(`🎉 Database cleanup complete!`);
    console.log(`Total records updated: ${facultyUpdated + adminsUpdated + studentsUpdated}`);

  } catch (error) {
    console.error('❌ Error during cleanup:', error);
  } finally {
    mongoose.disconnect();
  }
};

fixProfileImages();
