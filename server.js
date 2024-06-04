/* ******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 *******************************************/

/* ***********************
 * Require Statements here
 *************************/
const baseController = require("./controllers/baseController");
const inventoryRoute = require("./routes/inventoryRoute");
const accountRoutes = require("./routes/accountRoutes");
const errorRoute = require("./routes/errorRoute");  // Added line

const express = require("express");
const env = require("dotenv").config();
const expressLayouts = require("express-ejs-layouts");
const path = require('path');  // Added line
const cookieParser = require('cookie-parser');


const utilities = require('./utilities/index');

const app = express();

/* ***********************
 * Routes
 *************************/
app.use(require("./routes/static"));
// Serve static files from the 'public' folder
app.use(express.static(path.join(__dirname, 'public')));

app.use(cookieParser());


// Index route
app.get("/", async (req, res, next) => {
  try {
    let nav = await utilities.getNav();
    baseController.buildHome(req, res, { nav });  // Pass the nav variable as part of an object
  } catch (err) {
    next(err);
  }
});

app.get('/favicon.ico', (req, res) => res.status(204));


// General error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

app.use("/inv", inventoryRoute);
app.use('/account', accountRoutes);
app.use("/error", errorRoute); 

// File Not Found Route - must be last route in list
app.use(async (req, res, next) => {
  next({ status: 404, message: 'Sorry, we appear to have lost that page.' });
});

/* ***********************
 * View Engine and Templates
 *************************/
app.set("view engine", "ejs");
app.use(expressLayouts);
app.set("layout", "./layouts/layout"); // not at views root


// Apply middleware to check JWT
app.use(utilities.checkJWTToken);

/* ***********************
* Express Error Handler
* Place after all other middleware
*************************/
app.use(async (err, req, res, next) => {
  let nav = await utilities.getNav();
  console.error(`Error at: "${req.originalUrl}": ${err.message}`);
  console.error(err);  // Log the full error details
  if (err.status == 404) { message = err.message; } else { message = 'Oh no! There was a crash. Maybe try a different route?'; }
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
const port = process.env.PORT;
const host = process.env.HOST;

/* ***********************
 * Log statement to confirm server operation
 *************************/
app.listen(port, () => {
  console.log(`app listening on ${host}:${port}`);
});
