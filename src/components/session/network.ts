import { Router } from 'express';

import * as controller from './controller';

const router = Router();

router.post("/", controller.hasAccessToken);

export default router;