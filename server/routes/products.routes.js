// import Product from "../models/product.model";
// import express from "express";

// const app = express();
// app.use(express.json());

// app.post("/createProduct", async (req, res) => {
//     try {
//         const products = await Product.find({
//             user: req.user.id
//         }).populate("user");
//         res.json(products);
//     } catch (error) {
//         return res.status(500).json({ message: "Something went wrong" });
//     }
// })