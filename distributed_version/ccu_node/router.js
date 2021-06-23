const express = require('express');

const router = params => {

  const routerInstance = express.Router();

  // token checker

  // routes
  routerInstance.use(require('./routes.js')(params));

  return routerInstance;

};

module.exports = router;
