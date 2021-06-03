const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const helmet = require('helmet');
const xss = require('xss-clean');
const mongoSanitize = require('express-mongo-sanitize');
const compression = require('compression');
const cors = require('cors');
const passport = require('passport');
const httpStatus = require('http-status');
const config = require('./config/config');
const morgan = require('./config/morgan');
const { jwtStrategy } = require('./config/passport');
const { authLimiter } = require('./middlewares/rateLimiter');
const routes = require('./routes/v1');
const { errorConverter, errorHandler } = require('./middlewares/error');
const ApiError = require('./utils/ApiError');

const fullNodeHost = 'http://localhost:16667';
const solidityNodeHost = 'http://localhost:16668';
const eventServerHost = 'http://localhost:16670';

const app = express();

if (config.env !== 'test') {
  app.use(morgan.successHandler);
  app.use(morgan.errorHandler);
}

// set security HTTP headers
app.use(helmet());

// parse json request body
app.use(express.json());

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

// sanitize request data
app.use(xss());
app.use(mongoSanitize());

// gzip compression
app.use(compression());

// enable cors
app.use(cors());
app.options('*', cors());

// jwt authentication
app.use(passport.initialize());
passport.use('jwt', jwtStrategy);

// limit repeated failed requests to auth endpoints
if (config.env === 'production') {
  app.use('/v1/auth', authLimiter);
}

// v1 api routes
app.use('/v1', routes);

// proxy
app.use(
  '/node',
  createProxyMiddleware({
    target: fullNodeHost,
    changeOrigin: true,
    pathRewrite: {
      [`^/node`]: '',
    },
  })
);
app.use(
  '/solidity',
  createProxyMiddleware({
    target: solidityNodeHost,
    changeOrigin: true,
    pathRewrite: {
      [`^/solidity`]: '',
    },
  })
);
app.use(
  '/event',
  createProxyMiddleware({
    target: eventServerHost,
    changeOrigin: true,
    pathRewrite: {
      [`^/event`]: '',
    },
  })
);

// send back a 404 error for any unknown api request
app.use((req, res, next) => {
  next(new ApiError(httpStatus.NOT_FOUND, 'Not found'));
});

// convert error to ApiError, if needed
app.use(errorConverter);

// handle error
app.use(errorHandler);

module.exports = app;
