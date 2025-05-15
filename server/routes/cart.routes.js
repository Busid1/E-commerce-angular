import Stripe from "stripe";
import { Router } from "express";
import { authenticateToken } from "../middleware/jwt.middleware.js";
import User from '../models/user.model.js';
import Product from "../models/product.model.js";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const router = Router();

router.post("/user/cart", authenticateToken, async (req, res) => {
    const userId = req.userId;
    const { productId } = req.body;

    try {
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const cartItem = user.cart.find(item => item.product.equals(productId));
        if (cartItem) {
            // Incrementa la cantidad si el producto ya está en el carrito
            cartItem.quantity += 1;
        } else {
            // Agrega un nuevo producto al carrito
            user.cart.push({ product: productId, quantity: 1 });
        }

        await user.save();
        const updatedUser = await User.findById(userId).populate("cart.product");
        return res.status(200).json(updatedUser.cart);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
});

router.post("/user/cart/decrease", authenticateToken, async (req, res) => {
    const userId = req.userId;
    const { productId } = req.body;

    try {
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const cartItem = user.cart.find(item => item.product.equals(productId));
        if (cartItem) {
            // Incrementa la cantidad si el producto ya está en el carrito
            cartItem.quantity -= 1;
        } else {
            // Agrega un nuevo producto al carrito
            user.cart.push({ product: productId, quantity: 1 });
        }

        await user.save();
        const updatedUser = await User.findById(userId).populate("cart.product");
        return res.status(200).json(updatedUser.cart);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
});

router.get("/user/cart", authenticateToken, async (req, res) => {
    try {
        const userId = req.userId;
        const user = await User.findById(userId).populate("cart.product");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json(user.cart);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
});

router.get("/user/purchases", authenticateToken, async (req, res) => {
    try {
        const userId = req.userId;
        const user = await User.findById(userId).populate("purchases.product");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json(user.purchases);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
});

// Enviar pago a stripe
router.post("/user/cart/checkout", authenticateToken, async (req, res) => {
    const userId = req.userId
    try {
        const { id, amount, products } = req.body;

        await stripe.paymentIntents.create({
            amount,
            currency: "EUR",
            description: "product/s purchase",
            payment_method: id,
            confirm: true,
            automatic_payment_methods: {
                enabled: true,
                allow_redirects: "never",
            },
        })

        const user = await User.findByIdAndUpdate(
            userId,
            { cart: [] },
            { new: true }
        )

        for (const product of products) {
            const purchaseItem = user.purchases.find(purchase => purchase.product.equals(product.product._id));

            if (purchaseItem) {
                // Si el producto ya está en purchases, incrementamos su cantidad en MongoDB
                await User.findOneAndUpdate(
                    { _id: userId, "purchases.product": product.product._id },
                    { $inc: { "purchases.$.quantity": product.quantity } }, // Sumar la cantidad correcta
                    { new: true }
                );
            } else {
                // Si el producto no está en purchases, lo agregamos
                await User.findByIdAndUpdate(
                    userId,
                    {
                        $push: {
                            purchases: {
                                product: product.product._id,
                                quantity: product.quantity
                            }
                        }
                    },
                    { new: true }
                );
            }
        }

        const updatedUser = await User.findById(userId).populate("purchases");

        console.log("Lista de compras actualizada:", updatedUser.purchases);

        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }

        return res.send({ message: "Pago realizado correctamente" })
    } catch (error) {
        console.log(error)
        return res.json({ message: error })
    }
})

router.delete("/cart/:product_id", authenticateToken, async (req, res) => {
    try {
        const userId = req.userId;
        const productId = req.params.product_id;

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Filtramos el carrito para eliminar el producto
        user.cart = user.cart.filter(
            (item) => item.product.toString() !== productId
        );

        await user.save();

        return res.status(200).json({ message: "Product removed from cart" });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
});


export default router;