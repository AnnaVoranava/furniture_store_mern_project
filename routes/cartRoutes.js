const express = require("express");
const router = express.Router();
const { Cart } = require("../models/Cart");
const { Product } = require("../models/Product");
const { auth } = require("../middlewares/auth");
const jwt = require("jsonwebtoken");

const populate = {
    path: "cartDetails",
    populate: {
        path: "_product",
        model: "products",
        populate: {
            path: "_category",
            model: "categories",
        },
    },
};

router.post("/addToCart", auth, async (req, res) => {
    try {
        const product = await Product.findById(req.body._productId);

        const userHasCart = await Cart.exists({
            _customerId: req.customerId.toString(),
        });
        const isInCart = await Cart.exists({
            _customerId: req.customerId.toString(),
            "cartDetails._product": req.body._productId,
        });

        const productDetails = {
            _product: product,
            quantity: req.body.quantity,
            price: product.price,
            amount: (product.price * req.body.quantity).toFixed(2)

        };

        if (!userHasCart) {
            const newCart = new Cart({
                _customerId: req.customerId,
                cartDetails: [productDetails],
            });

            const savedCart = await newCart.save();
            const populatedCart = await Cart.findById(savedCart._id).populate(
                populate,
            );

            return res.status(200).json({
                status: true,
                message: "Product is added successfully",
                data: populatedCart,
            });
        }

        if (!isInCart) {
            const updatedCart = await Cart.findOneAndUpdate(
                {
                    _customerId: req.customerId,
                },
                {
                    $push: { cartDetails: productDetails },
                },
                { new: true },
            ).populate(populate);

            return res.status(200).json({
                status: true,
                message: "Product is added successfully",
                data: updatedCart,
            });
        }

        const updatedCart = await Cart.findOneAndUpdate(
            {
                _customerId: req.customerId,
                "cartDetails._product": req.body._productId,
            },
            {
                $inc: {
                    "cartDetails.$.quantity": req.body.quantity,
                    "cartDetails.$.amount": (product.price * req.body.quantity).toFixed(2)
                },
            },
            { new: true },
        ).populate(populate);

        if (updatedCart) {
            return res.status(200).json({
                status: true,
                message: "Item is added/updated successfully",
                data: updatedCart,
            });
        }
    } catch (error) {
        return res.status(500).json({
            status: false,
            error: error.message,
        });
    }
});

router.get("/", auth, async (req, res) => {
    const authorization = req.headers.authorization;
    const token = authorization?.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_KEY);

        const customerCart = await Cart.findOne({
            // here in request you're trying to get customer id from body, but in get requests there is nobody
            // you should consider either getting id from path/query parameter or from bearer token (which is the best practice for authentication)
            _customerId: decoded.customerId,
        }).populate(populate);

        return res.status(200).json({
            status: true,
            message: "Get customer cart successfully",
            data: customerCart,
        });
    } catch (error) {
        return res.status(500).json({
            status: false,
            error: error.message,
        });
    }
});

router.put ("/updateCartItem", auth, async (req, res) =>{
    const _productId= req.body._productId;
    const quantity = req.body.quantity;
    const product = await Product.findById(_productId);
    Cart.findOneAndUpdate({_customerId: req.customerId, "cartDetails._product": _productId},
    {$set:{"cartDetails.$.quantity":quantity,
            "cartDetails.$.amount": (product.price * quantity).toFixed(2)
         }}, {new: true}
    ).populate(populate).exec((error, data)=>{
        if(error) return res.status(400).json({status:false, error});
        return  res.status(200).json({
            status:true,
            message: "Item in cart has been updated successfully!",
            data,
        });
    });
});

router.put ("/removeCartItem/:id", auth, async (req, res) =>{
    const _productId= req.params.id;

    Cart.findOneAndUpdate({_customerId: req.customerId},
        {$pull:{cartDetails: { _product: _productId}
            }}, {new: true}
    ).populate(populate).exec((error, data)=>{
        if(error) return res.status(400).json({status:false, error});
        return  res.status(200).json({
            status:true,
            message: "Item in cart has been removed successfully!",
            data,
        });
    });
});

module.exports = router;