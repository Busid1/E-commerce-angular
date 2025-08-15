import dbConnect from "./db/dbConnect.js";
import express from "express";
import productRoutes from './routes/products.routes.js';
import authRoutes from './routes/auth.routes.js';
import cartRoutes from './routes/cart.routes.js';
import cors from "cors";
import { fileURLToPath } from 'url';
import path from 'path';
import cookieParser from "cookie-parser";

const app = express();

app.use(cors({
  origin: 'http://localhost:4200', 
  credentials: true                 
}));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', productRoutes);
app.use('/api/auth', authRoutes);
app.use('/api', cartRoutes);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, 'public')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

dbConnect();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});

export default app;