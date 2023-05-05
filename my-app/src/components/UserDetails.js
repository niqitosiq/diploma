import React from 'react';
import UserActivities from './UserActivities';

function UserDetails({ onClose }) {
  return (
    <div className="user-details">
      <div>
        <button role="button" onClick={onClose}>
          Закрыть
        </button>
      </div>

      {/* <UserActivities activities={user.activities} /> */}
    </div>
  );
}

export default UserDetails;
