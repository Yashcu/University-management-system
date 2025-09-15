const winston = require('winston');
const { combine, timestamp, json, errors, colorize, printf, simple } =
  winston.format;

const logger = winston.createLogger({
  level: 'info',
  format: combine(errors({ stack: true }), timestamp(), json()),
  transports: [
  ],
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(
    new winston.transports.Console({
      format: combine(
        colorize(),
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        printf(
          (info) => `${info.level}: ${info.message}`
        )
      ),
    })
  );
}

module.exports = logger;
