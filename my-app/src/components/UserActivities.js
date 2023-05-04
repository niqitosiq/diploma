import React from 'react';

function UserActivities({ activities }) {
  return (
    <div className="user-activities">
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
