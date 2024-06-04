// Import necessary modules
const express = require('express');
const router = express.Router();
const { invModel } = require('../models/inventory-model');
const { invCont, displayVehicleDetail } = require("../controllers/invController");


// Route handler to render the add classification view
router.get('/add-classification', (req, res) => {
    res.render('inventory/add-classification', { message: req.flash('message') });
});

// Route handler to process form submission for adding a new classification
router.post('/add-classification', async (req, res) => {
    // Perform server-side validation manually
    if (!req.body.classificationName) {
        req.flash('message', 'Classification name is required.');
        return res.redirect('/inv/add-classification');
    }

    try {
        // Process form submission and add classification to database
        await invModel.addClassification(req.body.classificationName);
        req.flash('message', 'Classification added successfully.');
        res.redirect('/inv'); // Redirect to management view
    } catch (error) {
        console.error('Error adding classification:', error);
        req.flash('message', 'An error occurred while adding the classification.');
        res.redirect('/inv/add-classification');
    }
});

router.get("/type/:classificationId", invCont.buildByClassificationId);

// Corrected Route
router.get("/detail/:vehicleId", displayVehicleDetail);


// Route handler to render the add inventory view
router.get('/add-inventory', async (req, res) => {
    // Fetch classifications from the database
    const classifications = await invModel.getClassifications();
    res.render('inventory/add-inventory', { classifications, message: req.flash('message') });
});

// Route handler to process form submission for adding a new inventory item
router.post('/add-inventory', async (req, res) => {
    // Perform server-side validation manually
    if (!req.body.vehicleName || !req.body.classificationId /* add more validation checks */) {
        req.flash('message', 'All fields are required.');
        return res.redirect('/inv/add-inventory');
    }

    try {
        // Process form submission and add inventory item to database
        await invModel.addInventory(req.body);
        req.flash('message', 'Inventory item added successfully.');
        res.redirect('/inv'); // Redirect to management view
    } catch (error) {
        console.error('Error adding inventory item:', error);
        req.flash('message', 'An error occurred while adding the inventory item.');
        res.redirect('/inv/add-inventory');
    }
});

module.exports = router;
