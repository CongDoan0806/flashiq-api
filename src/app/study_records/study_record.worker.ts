import { Worker, Job } from 'bullmq';
import { getBatch, updateScoreById } from './study_record.repository';
import { calculateNewScore } from './study_record.service';
import { studyRecordQueue } from './study_record.queue';
import { redisConnection } from '../../config/redis';

const BATCH_SIZE = 100;

export const setupWorker = () => {
  const worker = new Worker(
    'study-score-updates',
    async (job: Job) => {
      const { startAfterId } = job.data || {};

      const records = await getBatch(BATCH_SIZE, startAfterId);

      if (!records || records.length === 0) {
        console.log('QUEUE LOG: All records processed. Chain stopped.');
        return;
      }

      const updates = records.map(async (record: any) => {
        try {
          const newScore = calculateNewScore(
            record.last_reviewed,
            record.score
          );

          if (newScore !== record.score) {
            await updateScoreById(record.id, newScore);
          }
        } catch (err) {
          console.error(
            `QUEUE ERROR: Failed to update record ${record.id}:`,
            err
          );
        }
      });

      await Promise.all(updates);

      const lastRecord = records[records.length - 1];

      if (lastRecord && lastRecord.id) {
        await studyRecordQueue.add(
          'process-batch',
          { startAfterId: lastRecord.id },
          {
            removeOnComplete: true,
          }
        );
      }
    },
    {
      connection: redisConnection,
      concurrency: 5,
    }
  );

  worker.on('failed', (job, err) => {
    console.error(`Job ${job?.id} failed:`, err);
  });

  console.log('BULLMQ QUEUE: Study Score Worker Started');
};
