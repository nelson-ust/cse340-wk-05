const jwt = require('jsonwebtoken');
require('dotenv').config();
const bcrypt = require('bcrypt');
const accountModel = require('../models/accountModel');
const utilities = require('../middlewares/utilities');

async function accountLogin(req, res) {
  let nav = await utilities.getNav();
  const { account_email, account_password } = req.body;
  const accountData = await accountModel.getAccountByEmail(account_email);

  if (!accountData) {
    req.flash('notice', 'Please check your credentials and try again.');
    return res.status(400).render('account/login', {
      title: 'Login',
      nav,
      errors: null,
      account_email,
    });
  }

  try {
    if (await bcrypt.compare(account_password, accountData.account_password)) {
      delete accountData.account_password;
      const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 });

      res.cookie('jwt', accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'development',
        maxAge: 3600 * 1000,
      });

      return res.redirect('/account/');
    } else {
      req.flash('notice', 'Please check your credentials and try again.');
      return res.status(400).render('account/login', {
        title: 'Login',
        nav,
        errors: null,
        account_email,
      });
    }
  } catch (error) {
    console.error(error);
    req.flash('notice', 'An error occurred during login.');
    return res.status(500).render('account/login', {
      title: 'Login',
      nav,
      errors: null,
      account_email,
    });
  }
}

async function accountManagementView(req, res) {
  let nav = await utilities.getNav();
  res.render('account/management', {
    title: 'Account Management',
    nav,
    errors: null,
    successMessage: req.flash('success'),
  });
}

module.exports = {
  accountLogin,
  accountManagementView,
};
