import { Request, Response, NextFunction } from "express";

export const authorizeAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = (req as any).user;
  if (user && user.role === "ADMIN") {
    next();
  } else {
    res.status(403).json({ error: "Akses ditolak. Hanya untuk Admin." });
  }
};
