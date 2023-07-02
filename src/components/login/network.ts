import { Router } from "express";
import * as Controller from "./controller";

const LoginRouter = Router();

LoginRouter.post("/", Controller.login);

export default LoginRouter;