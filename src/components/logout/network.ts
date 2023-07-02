import { Router } from "express";
import { validateAccessToken } from "../../middleware/validateToken";
import * as Controller from "./controller";

const router = Router();

router.post("/", validateAccessToken, Controller.logout);

export default router;
