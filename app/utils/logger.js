const log4js = require('log4js');
const fs = require('fs');
const path = require('path');

const logsDir = path.join(__dirname, '../../logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

log4js.configure(require('../../logger.json'));

const logger = log4js.getLogger(`[${global.config.name}]`);

exports.logger = logger;