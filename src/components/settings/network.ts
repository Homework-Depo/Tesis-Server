import { Router } from "express";
import * as Controller from "./controller";
import validateToken from "../../middleware/validateToken";

const router = Router();

router.post("/", validateToken, Controller.main);
router.post("/enable2fa", validateToken, Controller.enable2fa);
router.post("/disable2fa", validateToken, Controller.disable2fa);

export default router;