import { Router } from "express";
import validateToken from "../../middleware/validateToken";
import * as Controller from "./controller";

const router = Router();

router.post("/", Controller.logout);

export default router;
