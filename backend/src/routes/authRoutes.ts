import express from "express";
import { login, register } from "../controllers/authController.js";

const router = express.Router();

// POST http://localhost:5000/api/auth/register
router.post("/register", register);

// POST http://localhost:5000/api/auth/login
router.post("/login", login);

export default router;
