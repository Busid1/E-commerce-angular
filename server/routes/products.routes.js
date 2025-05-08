import { Router } from "express";
import Product from "../models/product.model.js";
import User from '../models/user.model.js';
import { upload } from "../middleware/multer.js";
import { authenticateToken } from "../middleware/jwt.middleware.js";
import uploadImage from "../middleware/uploadImage.js";
import '../config/cloudinary.config.js';

const router = Router();

router.post("/createProduct", upload.single("image"), async (req, res) => {
    try {
        const imageFile = req.file

        let imageUrl = ""

        if (imageFile) {
            imageUrl = await uploadImage(imageFile)
        }
        const product = {
            ...req.body,
            image: imageUrl,
        }

        const newProduct = await Product.create(product)
        return res.status(201).json(newProduct)
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: err.message })
    }
})

router.get("/allProducts", async (req, res) => {
    try {
        const products = await Product.find()
        return res.status(200).json(products)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

router.get("/:product_id", async (req, res) => {
    try {
        const product = await Product.findById(req.params.product_id)

        if (!product) {
            return res.status(404).json({ message: "Product not found" })
        }
        return res.status(200).json(product)
    } catch (err) {
        return res.status(500).json({ message: err.message })
    }
})

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

router.put("/update/:product_id", upload.single("image"), async (req, res) => {
    try {
        const imageFile = req.file

        let imageUrl = req.body.image

        if (imageFile) {
            imageUrl = await uploadImage(imageFile)
        }

        const updateProduct = {
            ...req.body,
            image: imageUrl,
        }

        const product = await Product.findById(req.params.product_id)
        if (!product) {
            return res.status(404).json({ message: "Product not found" })
        }

        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.product_id,
            updateProduct
        )

        return res.status(200).json(updatedProduct)
    } catch (err) {
        return res.status(500).json({ message: err.message })
    }
})

router.delete("/delete/:product_id", async (req, res) => {
    try {
        const product = await Product.findById(req.params.product_id)

        if (!product) {
            return res.status(404).json({ message: "Product not found" })
        }

        const deletedProduct = await Product.findByIdAndDelete(
            req.params.product_id,
        )
        return res.status(200).json(deletedProduct)
    } catch (err) {
        return res.status(500).json({ message: err.message })
    }
})

export default router;