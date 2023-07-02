import { Router } from "express";
import * as Controller from "./controller";
import { validateAccessToken } from "../../middleware/validateToken";

const router = Router();

router.post("/", validateAccessToken, Controller.main);
router.post("/enable2fa", validateAccessToken, Controller.enable2fa);
router.post("/disable2fa", validateAccessToken, Controller.disable2fa);

export default router;