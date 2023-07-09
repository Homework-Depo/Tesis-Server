import { Router } from "express";
import * as Controller from "./controller";
import { validateAccessToken } from "../../middleware/validateToken";
import { upload } from "../../utils/multer";

const router = Router();

router.get("/create", validateAccessToken, Controller.findClient);
router.post("/create", validateAccessToken, Controller.createCase);
router.get("/", validateAccessToken, Controller.findAllCases);
router.get("/:id", validateAccessToken, Controller.findCase);
router.post("/:id/upload/", upload.array("files"), Controller.uploadFiles)

export default router;