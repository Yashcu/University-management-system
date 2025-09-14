const app = require('./src/app');
const connectToMongo = require('./src/database/db');
const config = require('./src/config');
const logger = require('./src/utils/logger')

// Connect to MongoDB
connectToMongo();

const port = config.port;

app.listen(port, () => {
  logger.info(`🚀 Server Listening On http://localhost:${port}`);
});
