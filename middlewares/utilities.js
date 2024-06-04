// middlewares/utilities.js

const db = require('../database/'); // Assuming you have a database module to interact with

/**
 * Get navigation data for rendering views.
 * This function fetches or generates navigation items for the application.
 */
async function getNav() {
  try {
    const result = await db.query('SELECT * FROM public.classification ORDER BY classification_name');
    return result.rows;
  } catch (error) {
    console.error('Error fetching navigation data:', error);
    return [];
  }
}

/**
 * Error handling middleware
 * @param {Function} fn - The controller function to wrap
 * @returns {Function} - A new function with error handling
 */
function handleErrors(fn) {
  return function (req, res, next) {
    fn(req, res, next).catch(next);
  };
}

module.exports = {
  getNav,
  handleErrors,
};

