import { Router } from "express";
import * as NotifController from "../controllers/notification.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";

const router = Router();
router.use(authenticate);

router.get("/", NotifController.list);
router.patch("/:id/read", NotifController.read);

export default router;
