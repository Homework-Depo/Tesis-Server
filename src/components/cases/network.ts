import { Router } from "express";
import * as Controller from "./controller";
import { validateAccessToken } from "../../middleware/validateToken";
import { upload } from "../../utils/multer";

const router = Router();

router.get("/create", validateAccessToken, Controller.findClient);
router.post("/create", validateAccessToken, Controller.createCase);
router.get("/", validateAccessToken, Controller.findAllCases);
router.get("/:id", validateAccessToken, Controller.findCase);
router.post("/:id/files/upload/", upload.array("files"), validateAccessToken, Controller.uploadFiles)
router.get("/:id/files/:fileId", validateAccessToken, Controller.findFile);
router.put("/:id", validateAccessToken, Controller.updateCase);

export default router;