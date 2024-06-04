// /controllers/invController

const invModel = require("../models/inventory-model");
const utilities = require("../utilities");

const invCont = {};

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  try {
    const classification_id = req.params.classificationId;
    const data = await invModel.getInventoryByClassificationId(classification_id);
    const grid = await utilities.buildClassificationGrid(data);
    const nav = await utilities.getNav();
    const className = data.length > 0 ? data[0].classification_name : "Unknown";

    // Pass the 'vehicles' data to the view
    res.render("./inventory/classification", {
      title: `${className} vehicles`,
      nav,
      grid,
      vehicles: data, // Pass the 'data' variable as 'vehicles' to the view
    });
  } catch (error) {
    next(error);
  }
};

// Example Controller Function
const displayVehicleDetail = async (req, res, next) => {
  try {
    const vehicleId = req.params.vehicleId;
    const vehicleData = await invModel.getVehicleDetail(vehicleId);
    // Check if 'inv_make' is present in vehicleData
    if (!vehicleData || !vehicleData.inv_make) {
      throw new Error("Invalid vehicle data");
    }
    const htmlContent = utilities.wrapInHTML(vehicleData);
    // res.render("inventory/detailView", { htmlContent });
    res.render('inventory/detailView', { htmlContent: htmlContent });

  } catch (err) {
    next(err);
  }
};

module.exports = { invCont, displayVehicleDetail };
