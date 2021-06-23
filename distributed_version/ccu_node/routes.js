const express = require('express');

const routesController = params => {

  const router = express.Router();

  const {
    db
  } = params;

  router.post('/login', (req, res) => {
    const {
      body: {
        username,
        password
      }
    } = req;
    res.send(`Hello ${username}! Your password is: ${password}`);
  });

  return router;

};

module.exports = routesController;
