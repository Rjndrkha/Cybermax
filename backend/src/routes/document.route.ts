import { Router } from "express";
import * as DocController from "../controllers/document.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { upload } from "middleware/upload.middleware.js";

const router = Router();
router.use(authenticate);

router.post("/", authenticate, upload.single("file"), DocController.upload);
router.patch(
  "/:id/update-file",
  upload.single("file"),
  DocController.updateFile
);
router.get("/", DocController.list);
router.post("/:id/request-delete", DocController.askDelete);
router.post("/:id/request-replace", DocController.askReplace);

export default router;
