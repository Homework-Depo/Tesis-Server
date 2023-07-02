import { Router } from "express";
import * as Controller from "./controller";
import validateToken from "../../middleware/validateToken";

const router = Router();

router.get("/", validateToken, Controller.findAllClients);
router.post("/create", validateToken, Controller.create);

export default router;