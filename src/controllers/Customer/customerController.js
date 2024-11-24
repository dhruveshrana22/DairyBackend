const Customer = require('../../modal/customer/Customer');
const Dealer = require('../../modal/customer/Dealer');
const auth = require('../../middleware/auth');

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
    const { name, mobile, address, desc } = req.body;

    // Validate the input
    if (!name || !mobile || !address || !desc) {
        return res.status(400).json({ msg: 'Please provide all required fields.' });
    }

    try {
        const newCustomer = new Customer({
            name,
            mobile,
            address,
            desc,
            user: req.user.id // Associate the customer with the logged-in user
        });

        await newCustomer.save();
        res.status(201).json({ msg: 'Customer added successfully', customer: newCustomer });
    } catch (error) {
        res.status(500).json({ msg: 'Error creating customer', error });
    }
}];

// Update a customer (Protected route)
exports.updateCustomer = [auth, async (req, res) => {
    const { id } = req.params;
    const { name, mobile, address, desc } = req.body;

    // Validate the input
    if (!name || !mobile || !address || !desc) {
        return res.status(400).json({ msg: 'Please provide all required fields.' });
    }

    try {
        // Ensure the customer belongs to the logged-in user before updating
        const updatedCustomer = await Customer.findOneAndUpdate(
            { _id: id, user: req.user.id }, // Ensure the user is authorized to update
            { name, mobile, address, desc },
            { new: true }
        );

        if (!updatedCustomer) {
            return res.status(404).json({ msg: 'Customer not found or you are not authorized' });
        }

        res.json({ msg: 'Customer updated successfully', customer: updatedCustomer });
    } catch (error) {
        res.status(500).json({ msg: 'Error updating customer', error });
    }
}];

// Delete a customer (Protected route)
exports.deleteCustomer = [auth, async (req, res) => {
    const { id } = req.params;

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



// Get all dealers (Protected route)
exports.getDealers = [auth, async (req, res) => {
    try {
        // Fetch only dealers associated with the logged-in user
        const dealers = await Dealer.find({ user: req.user.id });
        res.json({ dealers });
    } catch (error) {
        res.status(500).json({ msg: 'Error fetching dealers', error });
    }
}];

// Create a new dealer (Protected route)
exports.createDealer = [auth, async (req, res) => {
    const { name, mobile, address, desc } = req.body;

    // Validate the input
    if (!name || !mobile || !address) {
        return res.status(400).json({ msg: 'Please provide all required fields.' });
    }

    try {
        const newDealer = new Dealer({
            name,
            mobile,
            address,
            desc,
            user: req.user.id // Associate the dealer with the logged-in user
        });

        await newDealer.save();
        res.status(201).json({ msg: 'Dealer added successfully', dealer: newDealer });
    } catch (error) {
        res.status(500).json({ msg: 'Error creating dealer', error });
    }
}];

// Update a dealer (Protected route)
exports.updateDealer = [auth, async (req, res) => {
    const { id } = req.params;
    const { name, mobile, address, desc } = req.body;

    // Validate the input
    if (!name || !mobile || !address) {
        return res.status(400).json({ msg: 'Please provide all required fields.' });
    }

    try {
        // Ensure the dealer belongs to the logged-in user before updating
        const updatedDealer = await Dealer.findOneAndUpdate(
            { _id: id, user: req.user.id }, // Ensure the user is authorized to update
            { name, mobile, address, desc },
            { new: true }
        );

        if (!updatedDealer) {
            return res.status(404).json({ msg: 'Dealer not found or you are not authorized' });
        }

        res.json({ msg: 'Dealer updated successfully', dealer: updatedDealer });
    } catch (error) {
        res.status(500).json({ msg: 'Error updating dealer', error });
    }
}];

// Delete a dealer (Protected route)
exports.deleteDealer = [auth, async (req, res) => {
    const { id } = req.params;

    try {
        // Ensure the dealer belongs to the logged-in user before deleting
        const deletedDealer = await Dealer.findOneAndDelete({ _id: id, user: req.user.id });

        if (!deletedDealer) {
            return res.status(404).json({ msg: 'Dealer not found or you are not authorized' });
        }

        res.json({ msg: 'Dealer deleted successfully' });
    } catch (error) {
        res.status(500).json({ msg: 'Error deleting dealer', error });
    }
}];
