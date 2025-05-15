import { Router } from "express";
import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import "dotenv/config";
import jwt from 'jsonwebtoken';

const router = Router();
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

export default router;