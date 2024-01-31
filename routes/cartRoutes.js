const express = require('express');
const router = express.Router();
const { Cart } = require('../models/Cart');
const { Product } = require('../models/Product');
const { auth } = require('../middlewares/auth');

const populate = {
    path: 'cartDetails',
    populate: {
        path: '_product',
        model: 'products',
        populate: {
            path: '_category',
            model: 'categories',
        },
    },
};

router.post('/addToCart', auth, async (req, res) => {
    try {
        const customerCart = await Cart.findOne({
            _customerId: req.customer._id,
        });

        const product = await Product.findById(req.body._productId);
        const cartDetails = {
            _product: req.body._productId,
            quantity: req.body.quantity,
            price: product.price,
            amount: product.price * req.body.quantity,
        };

        if (customerCart) {
            const updatedCart = await Cart.findOneAndUpdate(
                {
                    _customerId: req.customer._id,
                    'cartDetails._product': req.body._productId,
                },
                {
                    $inc: {
                        'cartDetails.$.quantity': req.body.quantity,
                        'cartDetails.$.amount': product.price * req.body.quantity,
                    },
                },
                { new: true }
            ).populate(populate);

            if (updatedCart) {
                return res.status(200).json({
                    status: true,
                    message: 'Item is added/updated successfully',
                    data: updatedCart,
                });
            }
        }

        const newCart = new Cart({
            _customerId: req.customer._id,
            cartDetails: [cartDetails],
        });

        const savedCart = await newCart.save();
        const populatedCart = await Cart.findById(savedCart._id).populate(populate);

        return res.status(200).json({
            status: true,
            message: 'Item is added successfully',
            data: populatedCart,
        });
    } catch (error) {
        return res.status(500).json({
            status: false,
            error: error.message,
        });
    }
});

router.get('/', auth, async (req, res) => {
    try {
        const customerCart = await Cart.findOne({
            _customerId: req.customer._id,
        }).populate(populate);

        return res.status(200).json({
            status: true,
            message: 'Get customer cart successfully',
            data: customerCart,
        });
    } catch (error) {
        return res.status(500).json({
            status: false,
            error: error.message,
        });
    }
});

module.exports = router;
