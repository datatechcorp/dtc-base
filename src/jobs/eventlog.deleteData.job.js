// eslint-disable-next-line security/detect-child-process
const { exec } = require('child_process');
const cron = require('node-cron');
const logger = require('../config/logger');

const deleteDataJob = {
  task: cron.schedule(
    '* * */24 * * *',
    () => {
      exec('@scripts/eventlog.deleteData.sh', (error, stdout, stderr) => {
        if (error) {
          logger.error(`[JOB] Clean 'eventlog' Data >> Error Message: ${error.message}`);
          return;
        }
        if (stderr) {
          logger.error(`[JOB] Clean 'eventlog' Data >> Error Message: ${stderr}`);
          return;
        }
        logger.info(`[JOB] Clean 'eventlog' Data >> Message: ${stdout}`);
      });
    },
    {
      scheduled: false,
    }
  ),
  start() {
    logger.info(`[JOB] Clean 'eventlog' Data >> Start`);
    this.task.start();
  },
  stop() {
    logger.info(`[JOB] Clean 'eventlog' Data >> Stop`);
    this.task.stop();
  },
};

module.exports = deleteDataJob;
