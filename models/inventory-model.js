// /models/inventory-model.js

const pool = require("../database/");

/* ***************************
 * Get all classification data
 * ************************** */
async function getClassifications() {
  return await pool.query("SELECT * FROM public.classification ORDER BY classification_name");
}

/* ***************************
 * Get all inventory items and classification_name by classification_id
 * ************************** */
async function getInventoryByClassificationId(classification_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i 
        JOIN public.classification AS c 
        ON i.classification_id = c.classification_id 
        WHERE i.classification_id = $1`,
      [classification_id]
    );
    return data.rows;
  } catch (error) {
    console.error("getclassificationsbyid error " + error);
    throw error; // Rethrow the error for the caller to handle
  }
}

/* ***************************
 * Get vehicle details by vehicleId
 * ************************** */
const getVehicleDetail = async (vehicleId) => {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory WHERE inv_id = $1`,
      [vehicleId]
    );
    return data.rows[0]; // Assuming inv_id is a unique identifier
  } catch (error) {
    console.error("getVehicleDetail error " + error);
    throw error; // Re-throw the error for the caller to handle
  }
};

module.exports = { getClassifications, getInventoryByClassificationId, getVehicleDetail };
