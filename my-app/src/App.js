import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Locations from './components/Locations';
import UserList from './components/UserList';
import UserDetails from './components/UserDetails';
import Statistic from './components/Statistic';
import SearchUser from './components/SearchUser';
import './App.css';

function App() {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [fetchingInterval, setFetchingInterval] = useState(null);
  const fetchUsers = async () => {
    const response = await axios.get('http://localhost:3001/users');
    setUsers(response.data);
    setLoading(false);
  };

  const startFetchingUsers = () => {
    fetchUsers();
    setFetchingInterval(
      setInterval(() => {
        fetchUsers();
      }, 15000),
    );
  };

  const stopFetchingUsers = () => {
    clearInterval(fetchingInterval);
    setFetchingInterval(null);
  };

  useEffect(() => {
    startFetchingUsers();
    return stopFetchingUsers;
  }, []);

  const filteredUsers = users.filter(
    (user) => !searchQuery.length || user.name.includes(searchQuery),
  );

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <SearchUser searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

      <Locations
        users={filteredUsers}
        onMarkerClick={(selectedUser) => setSelectedUser(selectedUser)}
      />

      <UserList
        users={filteredUsers}
        onUserSelect={(selectedUser) => setSelectedUser(selectedUser)}
      />

      <Statistic users={filteredUsers} isPressedToBottom={!selectedUser} />

      {selectedUser && <UserDetails user={selectedUser} onClose={() => setSelectedUser(null)} />}
    </div>
  );
}
