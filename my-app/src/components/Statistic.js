import React, { useMemo } from 'react';
import StatisticColumn from './StatisticColumn';

const agesToShow = [
  {
    min: 0,
    max: 10,
  },
  {
    min: 10,
    max: 20,
  },
  {
    min: 20,
    max: 30,
  },
  {
    min: 30,
    max: 40,
  },
  {
    min: 40,
    max: 50,
  },
  {
    min: 50,
    max: 60,
  },
  {
    min: 60,
    max: 100,
  },
  {
    min: 100,
    max: 110,
  },
];

const Statistic = ({ users, isPressedToBottom }) => {
  const { ageCounts, maximumAge } = useMemo(() => {
    let ageCounts = agesToShow.map(({ min, max }) => ({ size: 0, label: `${min}-${max}` }));
    users.forEach((user) => {
      for (let i = 0; i < agesToShow.length; i++) {
        if (user.age >= agesToShow[i].min && user.age < agesToShow[i].max) {
          ageCounts[i].size++;
          break;
        }
      }
    });
    const maximumAge = ageCounts.sort((a, b) => a.size > b.size)[ageCounts.length - 1].size;

    return { ageCounts, maximumAge };
  }, [users]);

  return (
    <div className="statistic" style={{ bottom: isPressedToBottom ? '50px' : '250px' }}>
      {ageCounts.map(({ size, label }) => (
        <StatisticColumn size={size} label={label} maximumSize={maximumAge} />
      ))}
    </div>
  );
};

export default Statistic;
