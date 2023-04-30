import React, { useEffect } from 'react';

function UserList({ users, onUserSelect }) {
  return (
    <ul className="user-list">
      {users.map((user) => (
        <li key={user.id} onClick={() => onUserSelect(user)}>
          {user.name}
        </li>
      ))}
    </ul>
  );
}

export default UserList;
