import { Queue } from 'bullmq';
import { redisConnection } from '../../config/redis';

export const studyRecordQueue = new Queue('study-score-updates', {
  connection: redisConnection,
});

export const scheduleMidnightJob = async () => {
  await studyRecordQueue.add(
    'process-batch',
    { startAfterId: null },
    {
      repeat: { pattern: '0 0 * * *' },
      removeOnComplete: true,
    }
  );
  console.log('BULLMQ QUEUE: Midnight First-Job Scheduled');
};
