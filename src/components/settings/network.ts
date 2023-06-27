import { Router } from "express";
import * as Controller from "./controller";
import validateToken from "../../middleware/validateToken";

const router = Router();

router.post("/", validateToken, Controller.main);
/* router.post("/generate2fa", Controller.generate2fa); */
router.post("/verify2fa", Controller.verify2fa);

export default router;