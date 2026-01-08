import { Request, Response } from "express";
import * as AuthService from "../services/auth.service.js";

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: "Email dan password wajib diisi!",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        error: "Password minimal harus 6 karakter.",
      });
    }

    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        error: "Format email tidak valid.",
      });
    }

    const user = await AuthService.registerUser(email, password, role);
    res.status(201).json({ message: "User created", data: user });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: "Email dan password wajib diisi!",
      });
    }

    const data = await AuthService.loginUser(email, password);
    res.status(200).json({ message: "Login successful", ...data });
  } catch (error: any) {
    res.status(401).json({ error: error.message });
  }
};
