import React from 'react';

function UserActivities({ activities }) {
  // тут можно проверить оптимизацию от key.
  return (
    <div className="user-activities">
      <h2>User Activities</h2>
      <ul>
        {activities.map((activity) => (
          <li key={activity.id}>
            <h3>{activity.title}</h3>
            <p>{activity.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default UserActivities;
