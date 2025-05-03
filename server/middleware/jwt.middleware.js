import jwt from 'jsonwebtoken';
const SECRET_KEY = "SECRET_KEY";

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: "Token no proporcionado" });
  }

  const token = authHeader.split(' ')[1]; // Elimina "Bearer" del encabezado
  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.userId = decoded.userId; // Agrega el userId al objeto `req`
    req.role = decoded.role;    // Agrega el rol al objeto `req` si es necesario
    next();
  } catch (err) {
    return res.status(403).json({ message: "Token inválido o expirado" });
  }
};