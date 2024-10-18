const Customer = require('../../modal/customer/Customer');
const auth = require('../../middleware/auth'); // Import the auth middleware

// Get all customers (Protected route)
exports.getCustomers = [auth, async (req, res) => {
    try {
        // Fetch only customers associated with the logged-in user
        const customers = await Customer.find({ user: req.user.id });
        res.json({ customers });
    } catch (error) {
        res.status(500).json({ msg: 'Error fetching customers', error });
    }
}];

// Create a new customer (Protected route)
exports.createCustomer = [auth, async (req, res) => {
    const { name, mobile, address } = req.body;

    // Validate the input
    if (!name || !mobile || !address) {
        return res.status(400).json({ msg: 'Please provide all required fields.' });
    }

    try {
        const newCustomer = new Customer({
            name,
            mobile,
            address,
            user: req.user.id // Associate the customer with the logged-in user
        });
        await newCustomer.save();
        res.status(201).json({ msg: 'Customer added successfully', customer: newCustomer });
    } catch (error) {
        res.status(400).json({ msg: 'Error creating customer', error });
    }
}];

// Update a customer (Protected route)
exports.updateCustomer = [auth, async (req, res) => {
    const { id } = req.params; // Get customer ID from request params
    const { name, mobile, address } = req.body;

    // Validate the input
    if (!name || !mobile || !address) {
        return res.status(400).json({ msg: 'Please provide all required fields.' });
    }

    try {
        // Ensure the customer belongs to the logged-in user before updating
        const updatedCustomer = await Customer.findOneAndUpdate(
            { _id: id, user: req.user.id }, // Ensure the user is authorized to update
            { name, mobile, address },
            { new: true }
        );

        if (!updatedCustomer) {
            return res.status(404).json({ msg: 'Customer not found or you are not authorized' });
        }
        res.json({ msg: 'Customer updated successfully', customer: updatedCustomer });
    } catch (error) {
        res.status(400).json({ msg: 'Error updating customer', error });
    }
}];

// Delete a customer (Protected route)
exports.deleteCustomer = [auth, async (req, res) => {
    const { id } = req.params; // Get customer ID from request params

    try {
        // Ensure the customer belongs to the logged-in user before deleting
        const deletedCustomer = await Customer.findOneAndDelete({ _id: id, user: req.user.id });

        if (!deletedCustomer) {
            return res.status(404).json({ msg: 'Customer not found or you are not authorized' });
        }
        res.json({ msg: 'Customer deleted successfully' });
    } catch (error) {
        res.status(500).json({ msg: 'Error deleting customer', error });
    }
}];
