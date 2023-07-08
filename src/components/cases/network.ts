import { Router } from "express";
import * as Controller from "./controller";
import { validateAccessToken } from "../../middleware/validateToken";

const router = Router();

router.get("/create", validateAccessToken, Controller.findClient);
router.post("/create", validateAccessToken, Controller.createCase);
router.get("/", validateAccessToken, Controller.findAllCases);
router.get("/:id", validateAccessToken, Controller.findCase);

export default router;