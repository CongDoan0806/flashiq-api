import { BaseSuccessResponse } from '../../dto/SuccessResponse';
import {
  countCartInSet,
  countStudyRecord,
  deleteStudyRecords,
  getCardIdsInSet,
  getCardsWithProgress,
  findStudyRecordScore,
  getStudyRecords,
  insertStudyRecords,
  updateScore,
} from './study_record.repository';
import { BaseException } from '../../errors/BaseException';
import dayjs from 'dayjs';

export const getStudyRecordspProgress = async (
  userId: string,
  setId: string
) => {
  try {
    const cardCount = await countCartInSet(setId);
    const recordCount = await countStudyRecord(userId, setId);
    if (cardCount !== recordCount) {
      const cards = await getCardIdsInSet(setId);
      const records = await getStudyRecords(userId, setId);
      const cardIds = cards.map((c) => c.id);
      const recordCardIds = records.map((r) => r.cardId);

      const missingCardIds = cardIds.filter(
        (id) => !recordCardIds.includes(id)
      );
      if (missingCardIds.length > 0) {
        await insertStudyRecords(
          missingCardIds.map((cardId) => ({
            userId,
            setId,
            cardId,
          }))
        );
      }
      const extraRecordIds = recordCardIds.filter(
        (recordCardId) => !cardIds.includes(recordCardId)
      );

      if (extraRecordIds.length > 0) {
        await deleteStudyRecords(userId, extraRecordIds);
      }
    }
    const data = await getCardsWithProgress(userId, setId);
    return new BaseSuccessResponse(
      'Study records retrieved successfully',
      data
    );
  } catch (error: any) {
    throw new BaseException(error.status, error.message);
  }
};

export const updateStudyRecordScore = async (
  userId: string,
  cardId: string,
  isCorrect: boolean
) => {
  try {
    const currentScoreRecord = await findStudyRecordScore(userId, cardId);
    if (!currentScoreRecord) {
      throw new BaseException(400, 'Study record does not exist');
    }
    let score = currentScoreRecord.score;
    score += isCorrect ? 0.2 : -0.3;
    score = Math.round(Math.min(1, Math.max(0, score)) * 10) / 10;
    const data = await updateScore(userId, cardId, score);
    return new BaseSuccessResponse('Score updated successfully', data);
  } catch (error: any) {
    throw new BaseException(
      error.status || 500,
      error.message || 'Internal server error'
    );
  }
};

export const calculateNewScore = (
  lastStudyDate: Date,
  currentScore: number
) => {
  const today = dayjs();
  const reviewDate = dayjs(lastStudyDate);
  const daysDiff = today.diff(reviewDate, 'day');

  if (daysDiff < 2) return currentScore;

  let decayAmount = 0;

  if (currentScore >= 0.8) {
    if (daysDiff % 7 === 0) {
      decayAmount = 0.1;
    }
  } else if (currentScore >= 0.5) {
    if (daysDiff % 3 === 0) {
      decayAmount = 0.1;
    }
  } else {
    decayAmount = 0.1;
  }

  let newScore = currentScore - decayAmount;

  newScore = Math.round(newScore * 100) / 100;
  return newScore < 0 ? 0 : newScore;
};
