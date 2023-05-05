import React, { useMemo } from 'react';

const StatisticColumn = ({ size, label, maximumSize }) => {
  const relativeSize = useMemo(() => {
    return size / maximumSize;
  }, [size, maximumSize]);

  const backgroundColor = useMemo(() => {
    if (relativeSize > 0.3) return 'yellow';
    if (relativeSize > 0.6) return 'red';

    return 'green';
  }, [relativeSize]);

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
