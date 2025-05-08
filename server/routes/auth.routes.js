import { Router } from "express";
import Stripe from 'stripe';
import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import "dotenv/config";
import jwt from 'jsonwebtoken';
import { authenticateToken } from "../middleware/jwt.middleware.js";

const router = Router();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const SECRET_KEY = process.env.SECRET_KEY;

router.post('/register', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (user) {
            console.log("The email is already in use");
            return res.status(400).json(["The email is already in use"]);
        }

        const passwordHash = await bcrypt.hash(password, 10)
        const newUser = new User({
            email,
            password: passwordHash,
        });

        const userSaved = await newUser.save();
        const token = jwt.sign({ userId: userSaved._id, role: userSaved.role }, SECRET_KEY);

        res.json({
            id: userSaved._id,
            email: userSaved.email,
            authToken: token,
            role: "user"
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
        return res.status(400).send('Usuario no encontrado');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        return res.status(400).send('Contraseña incorrecta');
    }

    const token = jwt.sign({ userId: user._id, role: user.role }, SECRET_KEY, {
        algorithm: "HS256",
        expiresIn: "365d"
    });
    res.status(200).json({ authToken: token, role: user.role });
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
router.post("/user/checkout", authenticateToken, async (req, res) => {
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

        // Volvemos a obtener el usuario con la lista de compras actualizada
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

// Eliminar curso del carrito
router.delete("/cart/:product_id", authenticateToken, async (req, res) => {
    try {
        const userId = req.userId
        const { productId } = req.body

        const user = await User.findByIdAndUpdate(userId, {
            $pull: { "cart": { "product._id": productId } },
        }, { new: true })

        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }

        return res.status(200).json({ message: "Product removed from cart" })
    } catch (err) {
        return res.status(500).json({ message: err.message })
    }
})

export default router;