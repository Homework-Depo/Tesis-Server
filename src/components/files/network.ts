import { Router } from "express";
import { upload } from "../../utils/multer";
import * as Controller from "./controller";
import { validateAccessToken } from "../../middleware/validateToken";

const router = Router();

router.post("/", upload.array("files"), Controller.uploadFiles);
router.post("/:fileId/favorite", validateAccessToken, Controller.toggleFavorite);

export default router;