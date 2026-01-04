import { Router } from 'express';
import {
  bulkUpdateCards,
  deleteCard,
  getSingleCardById,
  updateCard,
} from '../app/cards/card.controller';
import { validate } from '../middlewares/validate.middleware';
import {
  bulkUpdateCardsSchema,
  singleCardSchema,
} from '../validations/card.schema';
import { authenticateAccessToken } from '../middlewares/auth.middleware';

const router = Router();

router.put(
  '/bulk',
  authenticateAccessToken,
  validate(bulkUpdateCardsSchema),
  bulkUpdateCards
);

router.get('/:id', authenticateAccessToken, getSingleCardById);
router.delete('/:id', authenticateAccessToken, deleteCard);
router.put(
  '/:id',
  validate(singleCardSchema),
  authenticateAccessToken,
  updateCard
);
export default router;
