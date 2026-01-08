import { Router } from "express";
import * as AdminController from "../controllers/admin.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { authorizeAdmin } from "../middleware/role.middleware.js";

const router = Router();
router.use(authenticate, authorizeAdmin);

router.get("/requests", AdminController.getRequests);
router.patch("/requests/:requestId", AdminController.handleAction);

export default router;
