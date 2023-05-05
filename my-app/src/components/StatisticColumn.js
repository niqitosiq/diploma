import React, { useMemo } from 'react';

const StatisticColumn = ({ size, label, maximumSize }) => {
  const relativeSize = useMemo(() => {
    return size / maximumSize;
  }, [size, maximumSize]);

  let backgroundColor = 'green';

  if (relativeSize > 0.3) backgroundColor = 'yellow';
  if (relativeSize > 0.6) backgroundColor = 'red';

  return (
    <div
      className="statistic-column"
      style={{ backgroundColor, height: `${parseInt(relativeSize * 100)}%` }}
    >
      {label}
    </div>
  );
};

export default StatisticColumn;
