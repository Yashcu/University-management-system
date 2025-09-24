require('dotenv').config();

const config = {
  port: process.env.PORT || 4000,
  mongodbUri: process.env.MONGODB_URI,
  jwtSecret: process.env.JWT_SECRET,
  frontendApiLink: process.env.FRONTEND_API_LINK,
  backendUrl: process.env.BACKEND_URL || 'http://localhost:4000',
  appDomain: process.env.APP_DOMAIN || 'college.com',

  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    apiSecret: process.env.CLOUDINARY_API_SECRET,
  },
  nodemailer: {
    email: process.env.NODEMAILER_EMAIL,
    pass: process.env.NODEMAILER_PASS,
  },
};

for (const key in config) {
  if (
    config[key] === undefined ||
    (typeof config[key] === 'object' &&
      Object.values(config[key]).some((v) => v === undefined))
  ) {
    console.warn(`⚠️ Warning: Missing environment variable for '${key}'`);
  }
}

module.exports = config;
