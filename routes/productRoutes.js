const Router = require('express').Router;
const { Product } = require('../models/Product');

const router = Router();

router.post('/', async (req, res) => {
    try {

        const data = await Product.find()
            .populate("_category")
            .exec();
        return res.status(200).json({
            status: true,
            message: 'Get product successfully!',
            data,
        });
    } catch (error) {
        return res.status(400).json({
            status: false,
            error: error.message,
        });
    }
});

router.post("/create", async (req, res) => {
    const product = new Product(req.body);
    try {
        const savedProduct = await product.save();
        return res.status(200).json({
            status: true,
            message: 'Product has been added successfully!',
            data: savedProduct,
        });
    } catch (error) {
        return res.status(400).json({
            status: false,
            error: error.message,
        });
    }
});

module.exports = router;
