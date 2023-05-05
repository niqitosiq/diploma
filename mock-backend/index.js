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
      lat: chance.latitude({ min: 28.0, max: 35.9 }),
      lng: chance.longitude({ min: -105, max: -70 }),
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

const users = [
  chance.n(generateUser, 1000),
  chance.n(generateUser, 1000),
  chance.n(generateUser, 1000),
  chance.n(generateUser, 1000),
  chance.n(generateUser, 1000),
  chance.n(generateUser, 1000),
  chance.n(generateUser, 1000),
  chance.n(generateUser, 1000),
  chance.n(generateUser, 1000),
  chance.n(generateUser, 1000),
];

function randomIntFromInterval(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

app.get('/users', (req, res) => {
  const usersIndex = randomIntFromInterval(0, 9);
  res.json(users[usersIndex]);
});

app.listen(3001, () => {
  console.log('Server is running on port 3001');
});
