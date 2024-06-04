// middlewares/validateRegistration.js

const { check, validationResult } = require('express-validator');

// Validation rules for login data
const loginRules = () => {
  return [
    check('account_email')
      .isEmail()
      .withMessage('Please enter a valid email address'),
    check('account_password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters long')
  ];
};

// Validation rules for registration data (if needed)
const registrationRules = () => {
  return [
    check('account_email')
      .isEmail()
      .withMessage('Please enter a valid email address'),
    check('account_password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters long'),
    check('account_confirm_password')
      .custom((value, { req }) => value === req.body.account_password)
      .withMessage('Passwords must match')
  ];
};

// Middleware to check login data
const checkLoginData = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const nav = []; // Or fetch the nav as needed
    return res.status(400).render('account/login', {
      title: 'Login',
      nav,
      errors: errors.array(),
      account_email: req.body.account_email
    });
  }
  next();
};

// Middleware to check registration data (if needed)
const checkRegistrationData = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const nav = []; // Or fetch the nav as needed
    return res.status(400).render('account/register', {
      title: 'Register',
      nav,
      errors: errors.array(),
      account_email: req.body.account_email
    });
  }
  next();
};

module.exports = {
  loginRules,
  registrationRules,
  checkLoginData,
  checkRegistrationData
};
