import express from 'express';
import cors from 'cors';
import Chance from 'chance';

const chance = new Chance();

const generateUser = () => {
  const activities = chance.n(
    () => ({
      id: chance.guid(),
      title: chance.sentence({ words: 5 }),
      description: chance.paragraph(),
    }),
    chance.integer({ min: 1, max: 5 }),
  );

  return {
    id: chance.guid(),
    name: chance.name(),
    email: chance.email(),
    address: chance.address(),
    age: chance.age(),
    coordinates: {
      lat: chance.latitude(),
      lng: chance.longitude(),
    },
    activities,
  };
};

const app = express();
app.use(
  cors({
    origin: '*',
  }),
);

app.get('/users', (req, res) => {
  const users = chance.n(generateUser, 1000);
  res.json(users);
});

app.listen(3001, () => {
  console.log('Server is running on port 3001');
});
