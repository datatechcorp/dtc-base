const mongoose = require('mongoose');
const app = require('./app');
const config = require('./config/config');
const logger = require('./config/logger');
const autoGenTxBot = require('./jobs/autogentx.bot');
const deleteDataJob = require('./jobs/eventlog.deleteData.job');
const { migrate } = require('./migrations');

let server;
mongoose.connect(config.mongoose.url, config.mongoose.options).then(() => {
  logger.info('\n');
  logger.info('=================');
  logger.info('=    dtc-base   =');
  logger.info('=================');
  logger.info(new Date());
  logger.info('Connected to MongoDB');
  migrate().then(() => {
    server = app.listen(config.port, () => {
      logger.info(`Listening to port ${config.port}`);
      if (config.env === 'production') {
        logger.info('Starting AutoGenTx Bot');
        autoGenTxBot.start();
        logger.info('Starting CleanData Job');
        deleteDataJob.start();
      }
    });
  });
});

const exitHandler = () => {
  if (server) {
    server.close(() => {
      logger.info('Server closed');
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};

const unexpectedErrorHandler = (error) => {
  logger.error(error);
  exitHandler();
};

process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);

process.on('SIGTERM', () => {
  logger.info('SIGTERM received');
  if (server) {
    server.close();
  }
});
