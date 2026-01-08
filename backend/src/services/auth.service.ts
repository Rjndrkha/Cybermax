import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "../lib/prisma.js";

const JWT_SECRET = process.env.JWT_SECRET;

export const registerUser = async (
  email: string,
  pass: string,
  role: "USER" | "ADMIN"
) => {
  const checkUser = await prisma.user.findUnique({ where: { email } });
  if (checkUser) {
    throw new Error("Failed to register user. Email already exists.");
  }

  const hashedPassword = await bcrypt.hash(pass, 10);
  return prisma.user.create({
    data: { email, password: hashedPassword, role },
  });
};

export const loginUser = async (email: string, pass: string) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error("User not found");

  const isMatch = await bcrypt.compare(pass, user.password);
  if (!isMatch) throw new Error("Invalid credentials");

  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    JWT_SECRET!,
    { expiresIn: "1d" }
  );

  return { user, token };
};
