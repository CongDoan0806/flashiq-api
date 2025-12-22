import { Router } from 'express';
import { register } from '../app/auth/auth.controller';
import { validate } from '../middlewares/validate.middleware';
import { registerSchema } from '../validations/auth.schema';
const router = Router();

router.post('/register', validate(registerSchema), register);

export default router;
