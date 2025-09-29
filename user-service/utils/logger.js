const { createLogger, format, transports } = require('winston');
const path = require('path');

const logger = createLogger({
  level: 'info', // Default log level
  format: format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.errors({ stack: true }), // Show stack trace for errors
    format.splat(), // Allows string interpolation like printf
    format.json() // Output logs in JSON format (better for production)
  ),
  transports: [
    // ✅ Console logs (visible in Docker logs)
    new transports.Console({
      format: format.combine(
        format.colorize(), // Colors for console logs
        format.simple() // Pretty format in console
      )
    }),

    // ✅ File logs (stored in logs folder)
    new transports.File({
      filename: path.join(__dirname, '../logs/error.log'),
      level: 'error' // Only log errors in this file
    }),

    new transports.File({
      filename: path.join(__dirname, '../logs/combined.log')
    })
  ],
  exitOnError: false
});

module.exports = logger;