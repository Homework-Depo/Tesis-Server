import { Router } from "express";
import * as Controller from "./controller";
import { validateAccessToken } from "../../middleware/validateToken";

const router = Router();

router.get("/", validateAccessToken, Controller.main);

export default router;