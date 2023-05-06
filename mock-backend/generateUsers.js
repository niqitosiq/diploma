import Chance from 'chance';
import fs from 'fs';

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

const users = chance.n(generateUser, 500);

fs.writeFile('./users.json', JSON.stringify(users), 'utf8', () => {});
