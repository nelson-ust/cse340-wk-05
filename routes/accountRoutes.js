const express = require('express');
const router = express.Router();
const accountController = require('../controllers/accountController');
const regValidate = require('../middlewares/validateRegistration');
const utilities = require('../middlewares/utilities');

// Process the login request
router.post(
  '/login',
  regValidate.loginRules(),
  regValidate.checkLoginData,
  utilities.handleErrors(accountController.accountLogin)
);

// Add the default account route
router.get("/", utilities.handleErrors(accountController.accountManagementView));

module.exports = router;
