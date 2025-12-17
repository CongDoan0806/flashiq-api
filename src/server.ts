import app from './app';

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
  console.log(`API Docs available at http://localhost:${port}/api-docs`);
});
