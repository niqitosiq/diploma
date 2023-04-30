import React from 'react';

const SearchUser = ({ searchQuery, setSearchQuery }) => {
  return (
    <div className="search-user">
      <input value={searchQuery} onInput={({ target }) => setSearchQuery(target.value)} />
    </div>
  );
};

export default SearchUser;
