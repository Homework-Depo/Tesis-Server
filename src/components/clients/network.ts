import { Router } from "express";
import * as Controller from "./controller";
import { validateAccessToken } from "../../middleware/validateToken";

const router = Router();

router.get("/", validateAccessToken, Controller.findAllClients);
router.post("/create", validateAccessToken, Controller.create);

export default router;