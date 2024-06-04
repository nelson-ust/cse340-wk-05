/* ******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 *******************************************/

/* ***********************
 * Require Statements here
 *************************/
const session = require("express-session");
const pool = require('./database');
const flash = require('connect-flash');

const baseController = require("./controllers/baseController");
const inventoryRoute = require("./routes/inventoryRoute");
const errorRoute = require("./routes/errorRoute");

const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const path = require('path');
const utilities = require('./utilities/index');

const app = express();

/* ***********************
 * View Engine and Templates
*************************/
app.set("view engine", "ejs");
app.use(expressLayouts);
app.set("layout", "./layouts/layout");

/* ***********************
 * Session Middleware
 *************************/
app.use(session({
  store: new (require('connect-pg-simple')(session))({
    createTableIfMissing: true,
    pool,
  }),
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  name: 'sessionId',
}));

/* ***********************
 * Flash Messages Middleware
 *************************/
app.use(flash());

/* ***********************
 * Routes
 *************************/
app.use(require("./routes/static"));
app.use(express.static(path.join(__dirname, 'public')));

// Index route
app.get("/", async (req, res, next) => {
  try {
    let nav = await utilities.getNav();
    baseController.buildHome(req, res, { nav });
  } catch (err) {
    next(err);
  }
});

app.use("/inv", inventoryRoute);
app.use("/error", errorRoute);

// File Not Found Route - must be last route in list
app.use(async (req, res, next) => {
  next({ status: 404, message: 'Sorry, we appear to have lost that page.' });
});

/* ***********************
* Express Error Handler
* Place after all other middleware
*************************/
app.use(async (err, req, res, next) => {
  let nav = await utilities.getNav();
  console.error(`Error at: "${req.originalUrl}": ${err.message}`);
  console.error(err);
  const message = err.status == 404 ? err.message : 'Oh no! There was a crash. Maybe try a different route?';
  res.status(err.status || 500).render("errors/error", {
    title: err.status || 'Server Error',
    message,
    nav
  });
});

/* ***********************
 * Local Server Information
 * Values from .env (environment) file
 *************************/
const port = process.env.PORT || 5500;
const host = process.env.HOST || 'localhost';

/* ***********************
 * Log statement to confirm server operation
 *************************/
app.listen(port, host, () => {
  console.log(`app listening on ${host}:${port}`);
});
