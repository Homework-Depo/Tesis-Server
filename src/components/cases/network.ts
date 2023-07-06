import { Router } from "express";
import * as Controller from "./controller";
import { validateAccessToken } from "../../middleware/validateToken";

const router = Router();

router.get("/create", validateAccessToken, Controller.get);
router.post("/create", validateAccessToken, Controller.createCase);

export default router;