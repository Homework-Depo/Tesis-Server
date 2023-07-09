import { Router } from "express";
import { upload } from "../../utils/multer";
import * as Controller from "./controller";

const router = Router();

router.post("/", upload.array("files"), Controller.uploadFiles);

export default router;