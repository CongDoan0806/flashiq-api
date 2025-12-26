import app from './app';
import { ENV } from './config/env';

const port = ENV.PORT;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
  console.log(`API Docs available at http://localhost:${port}/api-docs`);
});
