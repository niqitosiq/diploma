import React from 'react';
import UserActivities from './UserActivities';

function UserDetails({ user, onClose }) {
  if (!user) return <div>Select a user</div>;

  return (
    <div className="user-details">
      <div>
        <button role="button" onClick={onClose}>
          Закрыть
        </button>
        <h2>{user.name}</h2>
      </div>

      <UserActivities activities={user.activities} />
    </div>
  );
}

export default UserDetails;
