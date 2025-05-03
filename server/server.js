import dbConnect from "./db/dbConnect.js";
import express from "express";
import bcrypt from "bcrypt";
import cors from "cors";
import User from './models/user.model.js';
import jwt from 'jsonwebtoken';
import Product from "./models/product.model.js";
import './config/cloudinary.config.js';
import uploadImage from "./middleware/uploadImage.js";
import { upload } from "./middleware/multer.js";
import { authenticateToken } from "./middleware/jwt.middleware.js";
import Stripe from "stripe";
const app = express();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const SECRET_KEY = "SECRET_KEY";

app.use(express.json());

const corsOptions = {
  origin: (origin, callback) => {
    callback(null, origin || '*'); // Permite cualquier origen dinámicamente
  },
  credentials: true,
};

app.use(cors(corsOptions));

dbConnect();

app.post('/register', async (req, res) => {
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

    // const adminUser = new User({
    //   email: 'admin@admin.com',
    //   password: await bcrypt.hash('admin', 10),
    //   role: 'admin'
    // });
    // await adminUser.save();

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

app.post('/login', async (req, res) => {
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

app.post("/createProduct", upload.single("image"), async (req, res) => {
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

app.get("/allProducts", async (req, res) => {
  try {
    const products = await Product.find()
    return res.status(200).json(products)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

app.get("/:product_id", async (req, res) => {
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

app.put("/update/:product_id", upload.single("image"), async (req, res) => {
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

app.delete("/delete/:product_id", async (req, res) => {
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

app.post("/user/cart", authenticateToken, async (req, res) => {
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

app.post("/user/cart/decrease", authenticateToken, async (req, res) => {
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

app.get("/user/cart", authenticateToken, async (req, res) => {
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

app.get("/user/purchases", authenticateToken, async (req, res) => {
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

// Eliminar curso del carrito
app.delete("/cart/:product_id", authenticateToken, async (req, res) => {
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

// Enviar pago a stripe
app.post("/user/checkout", authenticateToken, async (req, res) => {
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

app.listen(2000, () => {
  console.log('Servidor escuchando en el puerto 2000');
});
