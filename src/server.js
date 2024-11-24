const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');  // Import cors
const { DB_Name } = require('./constants');
const authRoutes = require('./route/auth');

const app = express();

// Use CORS middleware
app.use(cors());  // Enable CORS for all routes

// Body parser middleware to handle JSON data
app.use(express.json());  // Add this to parse JSON

(async () => {
    try {
        // MongoDB connection
        const mongoURI = "mongodb+srv://dhrurana96:A3I97iYp1aiuZOfc@cluster0.jdywl.mongodb.net/BizWise?retryWrites=true&w=majority&appName=Cluster0" + DB_Name;
        await mongoose.connect(mongoURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("MongoDB connected successfully");
        app.get('/', (req, res) => {
            res.json({ message: "Welcome To DC Site Nai Male Bhai" });
        });

        // Register routes
        app.use('/api/auth', authRoutes);  // Use auth routes

        // Start server
        const PORT = process.env.PORT || 5000;
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (err) {
        console.log("Error connecting to MongoDB:", err);
    }
})();
