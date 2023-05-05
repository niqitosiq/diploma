import React from 'react';

function UserList({ users, onUserSelect }) {
  return (
    <ul className="user-list">
      {users.map((user) => {
        const onLiClick = () => onUserSelect(user);
        return (
          <li key={user.id} onClick={onLiClick}>
            {user.name}
          </li>
        );
      })}
    </ul>
  );
}

export default UserList;
