import dbConnect from "./db/dbConnect.js";
import express from "express";
import productRoutes from './routes/products.routes.js';
import authRoutes from './routes/auth.routes.js';
import cors from "cors";
const app = express();
const corsOptions = {
  origin: (origin, callback) => {
    callback(null, origin || '*'); // Permite cualquier origen dinámicamente
  },
  credentials: true,
};

// Middlewares
app.use(express.json());
app.use(cors(corsOptions));

// Rutas
app.use('/', productRoutes);
app.use('/', authRoutes);

// Base de datos
dbConnect();

// Puerto
const PORT = process.env.PORT || 2000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
