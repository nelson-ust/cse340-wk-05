// errorRoute.js

const express = require('express');
const router = new express.Router();

router.get('/trigger-error', (req, res, next) => {
  // Intentional error to trigger a 500-type error
  throw new Error('Intentional error for testing 500-type error');
});

module.exports = router;
