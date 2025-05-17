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

// Middlewares
app.use(cookieParser())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'] 
}));

// Rutas
app.use('/api', productRoutes);
app.use('/api/auth', authRoutes);
app.use('/api', cartRoutes);

// __dirname en módulos ES
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Servir archivos estáticos desde Angular
app.use(express.static(path.join(__dirname, '../client/dist/e-commerce/browser')));

// Redirigir cualquier otra ruta al index.html (SPA)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/dist/e-commerce/browser/index.html'));
});

// Base de datos
dbConnect();

// Puerto
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});

export default app;