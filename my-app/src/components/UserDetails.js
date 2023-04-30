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
        <p>Email: {user.email}</p>
        <p>Username: {user.username}</p>
        <p>Phone: {user.phone}</p>
        <p>Website: {user.website}</p>
        <p>
          Address: {user.address.street}, {user.address.suite}, {user.address.city},{' '}
          {user.address.zipcode}
        </p>
      </div>

      <UserActivities activities={user.activities} />
    </div>
  );
}

export default UserDetails;
