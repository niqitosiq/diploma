import React, { useState, useCallback, useEffect, useMemo, useRef } from 'react';
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
  const fetchingInterval = useRef(null);
  const fetchUsers = async () => {
    const response = await axios.get('http://localhost:3001/users');
    setUsers(response.data);
    setLoading(false);
  };

  const startFetchingUsers = () => {
    fetchUsers();
    fetchingInterval.current = setInterval(() => {
      fetchUsers();
    }, 40000);
  };

  const stopFetchingUsers = () => {
    clearInterval(fetchingInterval.current);
    fetchingInterval.current = null;
  };

  useEffect(() => {
    startFetchingUsers();
    return stopFetchingUsers;
  }, []);

  const filteredUsers = useMemo(() => {
    return users.filter((user) => !searchQuery.length || user.name.includes(searchQuery));
  }, [users, searchQuery]);

  const closeUserDetails = useCallback(() => setSelectedUser(null), []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <SearchUser searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

      <Locations users={filteredUsers} onMarkerClick={setSelectedUser} />

      <UserList users={filteredUsers} onUserSelect={setSelectedUser} />

      <Statistic users={filteredUsers} isPressedToBottom={!selectedUser} />

      {selectedUser && <UserDetails user={selectedUser} onClose={closeUserDetails} />}
    </div>
  );
}

export default App;
