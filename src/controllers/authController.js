const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../modal/users');
const { JWT_SECRET } = require('../constants');

// @desc    Register a new user
exports.register = async (req, res) => {
    const { name, email, password, phone } = req.body;
    console.log("🚀 ~ exports.register= ~ req.body:", req.body)

    try {
        // Check if user already exists
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ msg: 'User already exists' });
        }

        // Create a new user instance
        user = new User({
            name,
            email,
            password,
            phone
        });

        // Hash password before saving in database
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        await user.save(); // Save the user to the database

        // Create and sign the JWT token
        const payload = {
            user: {
                id: user.id
            }
        };

        jwt.sign(
            payload,
            JWT_SECRET,
            { expiresIn: '1h' },
            (err, token) => {
                if (err) throw err;
                res.json({ token }); // Return the JWT token
            }
        );
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};
exports.getUser = async (req, res) => {
    try {
        // Retrieve all users from the database and exclude passwords
        const users = await User.find().select('-password');

        // Check if any users are found
        if (users.length === 0) {
            return res.status(404).json({ msg: 'No users found' });
        }

        // Store users in a single object
        const responseData = {
            count: users.length, // Number of users
            users: users // List of user data
        };

        res.json(responseData); // Return the consolidated data
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};


// In your user controller
exports.login = async (req, res) => {
    const { email, password, id } = req.body;
    console.log("🚀 ~ exports.login= ~ req.body:", req.body)

    try {
        // Check if user exists
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        // Check if password matches
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        // Create and sign the JWT token
        const payload = {
            user: {
                id: user.id
            }
        };

        jwt.sign(
            payload,
            JWT_SECRET,
            { expiresIn: '500h' }, // Token valid for 1 hour
            (err, token) => {
                if (err) throw err;
                res.json({ token }); // Return the JWT token
            }
        );
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};
