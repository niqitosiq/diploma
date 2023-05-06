import express from 'express';
import cors from 'cors';
import { users } from './users.js';

const app = express();
app.use(
  cors({
    origin: '*',
  }),
);

app.get('/users', (req, res) => {
  res.json(users);
});

app.listen(3001, () => {
  console.log('Server is running on port 3001');
});
