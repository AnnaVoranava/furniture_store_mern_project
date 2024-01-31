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

router.post("/addToCart", auth, async (req, res) => {
    try {
        const product = await Product.findById(req.body._productId);
        const customerCart = await Cart.findOne({
            _customerId: req.customerId,
        });

        const cartDetails = {
            _product: req.body._productId,
            quantity: req.body.quantity,
            price: product.price,
            amount: product.price * req.body.quantity,
        };

        if (customerCart) {
            // Check if the product is already in the cart
            const existingProductIndex = customerCart.cartDetails.findIndex(item => item._product.equals(req.body._productId));

            if (existingProductIndex !== -1) {
                // If the product is already in the cart, update the quantity and amount
                customerCart.cartDetails[existingProductIndex].quantity += req.body.quantity;
                customerCart.cartDetails[existingProductIndex].amount += product.price * req.body.quantity;
                await customerCart.save();

                return res.status(200).json({
                    status: true,
                    message: 'Product quantity updated successfully',
                    data: customerCart,
                });
            } else {
                // If the product is not in the cart, add it
                customerCart.cartDetails.push(cartDetails);
                await customerCart.save();

                return res.status(200).json({
                    status: true,
                    message: "Product added to cart successfully",
                    data: customerCart,
                });
            }
        } else {
            // If the customer doesn't have a cart, create a new one
            const newCart = new Cart({
                _customerId: req.customerId,
                cartDetails: [cartDetails],
            });

            const savedCart = await newCart.save();

            return res.status(200).json({
                status: true,
                message: 'Product added to cart successfully',
                data: savedCart,
            });
        }
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
