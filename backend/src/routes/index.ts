import { Router } from "express";
import authRoutes from "./auth.route.js";
import docRoutes from "./document.route.js";
import adminRoutes from "./admin.route.js";
import notifRoutes from "./notification.route.js";

const router = Router();

router.use("/auth", authRoutes);

router.use("/documents", docRoutes);

router.use("/admin", adminRoutes);

router.use("/notifications", notifRoutes);

export default router;
