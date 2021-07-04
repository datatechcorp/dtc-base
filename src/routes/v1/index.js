const express = require('express');
const config = require('../../config/config');
const basicRoute = require('./basic.route');
const authRoute = require('./auth.route');
const userRoute = require('./user.route');
const docsRoute = require('./docs.route');
const accRoute = require('./account.route');
const contrRoute = require('./contract.route');

const router = express.Router();

const defaultRoutes = [
  {
    path: '/',
    route: basicRoute,
  },
  {
    path: '/auth',
    route: authRoute,
  },
  {
    path: '/users',
    route: userRoute,
  },
  {
    path: '/accounts',
    route: accRoute,
  },
  {
    path: '/contracts',
    route: contrRoute,
  },
];

const devRoutes = [
  // routes available only in development mode
  {
    path: '/docs',
    route: docsRoute,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

/* istanbul ignore next */
if (config.env === 'development') {
  devRoutes.forEach((route) => {
    router.use(route.path, route.route);
  });
}

module.exports = router;
