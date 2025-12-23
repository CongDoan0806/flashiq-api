import { Router } from 'express';
import {
  register,
  resendVerificationEmail,
  verifyEmail,
} from '../app/auth/auth.controller';
import { validate } from '../middlewares/validate.middleware';
import { registerSchema, resendEmailSchema } from '../validations/auth.schema';
const router = Router();

router.post('/register', validate(registerSchema), register);
router.get('/verify-email', verifyEmail);
router.post(
  '/resend-verification',
  validate(resendEmailSchema),
  resendVerificationEmail
);

export default router;
