const express = require('express');
const router = express.Router();
const { register, login, getUser } = require('../controllers/authController');

const user = require('../modal/users');
const auth = require("../middleware/auth");
const { getProducts, createProduct, updateProduct, deleteProduct } = require('../controllers/productController');
const { getCustomers, createCustomer, updateCustomer, deleteCustomer, getDealers, createDealer, updateDealer, deleteDealer } = require('../controllers/Customer/customerController');

// @route    GET /api/auth/user
// @desc     Get user data by token
// @access   Private
router.get('/dhruvesh', async (req, res) => {
    try {
        const users = await user.find(); // Fetch all users from the database
        res.json(users); // Send the user data as a JSON response
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

// @route    POST /api/auth/register
// @desc     Register a new user
// @access   Public
router.post('/register', register);
router.get('/getUser', getUser);
router.post('/login', login);

router.get('/test', auth, (req, res) => {
    res.json({ msg: 'Token is valid', user: req.user });
});

// Add products 
router.get('/getProducts', auth, getProducts);

// POST create a new product
router.post('/createProduct', auth, createProduct);
router.put('/getProducts/:id', auth, updateProduct);

// DELETE a product
router.delete('/getProducts/:id', auth, deleteProduct);

// Customers routes
router.get('/customers', auth, getCustomers);
router.post('/createCustomers', auth, createCustomer);
router.put('/customers/:id', auth, updateCustomer);
router.delete('/customers/:id', auth, deleteCustomer);
// Dealer routes
router.get('/dealers', auth, getDealers); // Get all dealers
router.post('/createDealers', auth, createDealer); // Create a new dealer
router.put('/dealers/:id', auth, updateDealer); // Update a dealer by ID
router.delete('/dealers/:id', auth, deleteDealer); // Delete a dealer by ID

module.exports = router;
