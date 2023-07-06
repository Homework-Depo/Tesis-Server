import { Router } from "express";
import * as Controller from "./controller";
import { validateAccessToken } from "../../middleware/validateToken";

const router = Router();

router.get("/", validateAccessToken, Controller.findAllClients);
router.post("/create", validateAccessToken, Controller.create);
router.get("/:id", validateAccessToken, Controller.findOneClient);
router.put("/:id/update", validateAccessToken, Controller.updateClient);

export default router;