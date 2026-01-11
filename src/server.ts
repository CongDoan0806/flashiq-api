import app from './app';
import { scheduleMidnightJob } from './app/study_records/study_record.queue';
import { setupWorker } from './app/study_records/study_record.worker';
import { ENV } from './config/env';

const port = ENV.PORT;

app.listen(port, async () => {
  await scheduleMidnightJob();
  setupWorker();
  console.log(`Server running on port ${port}`);
  console.log(`API Docs available at http://localhost:${port}/api-docs`);
});
