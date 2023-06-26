import { Router } from "express";
import * as Controller from "./controller";

const LoginRouter = Router();

LoginRouter.post("/", Controller.login);
LoginRouter.post("/2fa", Controller.verify2FA);
LoginRouter.post("/jwt", Controller.verifyJwt);
/* LoginRouter.post("/2fa/generate", Controller.generate2FA); */

export default LoginRouter;