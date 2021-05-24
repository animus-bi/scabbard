const winston = require('winston');
const minimist = require('minimist');

var argv = minimist(process.argv.slice(2));

const combinedFormat = winston.format.combine(
  winston.format.prettyPrint(),
  winston.format.colorize({ all: true }),
  winston.format.printf((info) => {
    if (typeof info.message === 'object') {
      info.message = JSON.stringify(info.message, null, 3)
    }

    return info.message;
  }),
)

export const logger = winston.createLogger({
  level: argv.logLevel || 'info',
  format: combinedFormat,
  transports: [
    new winston.transports.Console({
      format: combinedFormat
    })
  ],
});
