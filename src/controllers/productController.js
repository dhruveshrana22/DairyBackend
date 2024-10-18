
// @desc    Fetch all products
// @route   GET /api/products

const Product = require("../modal/Products");

// @access  Public
// @desc    Fetch all products or search products
// @route   GET /api/products
// @access  Public
const escapeRegex = (text) => {
    return text.replace(/[-\/\\^$.*+?()[\]{}|]/g, '\\$&');
};
const getProducts = async (req, res) => {
    const searchQuery = escapeRegex(req.query.search || ""); // Get the search query from request parameters

    try {
        const products = await Product.find({
            productName: { $regex: searchQuery, $options: "i" } // Case-insensitive search
        });
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};


// @desc    Create a new product
// @route   POST /api/products
// @access  Public
const createProduct = async (req, res) => {
    const { productName, purchasePrice, salePrice } = req.body;

    try {
        // Check if the product already exists
        const existingProduct = await Product.findOne({ productName });
        console.log("🚀 ~ createProduct ~ existingProduct:", existingProduct)

        if (existingProduct) {
            // Return a 400 status code if the product already exists
            return res.status(201).json({ message: 'Product already exists' });
        }
        else {
            // Create a new product
            const product = new Product({
                productName,
                purchasePrice,
                salePrice
            });
            const createdProduct = await product.save();
            res.status(201).json(createdProduct);
        }

    } catch (error) {
        res.status(400).json({ message: 'Invalid product data', error: error.message });
    }
};


// @desc    Update an existing product
// @route   PUT /api/products/:id
// @access  Public
const updateProduct = async (req, res) => {
    const { productName, purchasePrice, salePrice } = req.body;

    try {
        const product = await Product.findById(req.params.id);

        if (product) {
            product.productName = productName || product.productName;
            product.purchasePrice = purchasePrice || product.purchasePrice;
            product.salePrice = salePrice || product.salePrice;

            const updatedProduct = await product.save();
            res.json(updatedProduct);
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Public
const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);

        if (product) {
            res.json({ message: 'Product removed' });
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};


module.exports = {
    getProducts,
    createProduct,
    updateProduct,
    deleteProduct
};
