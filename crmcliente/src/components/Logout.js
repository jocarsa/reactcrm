// components/Logout.js
import React from 'react';

const Logout = ({ setToken }) => {
  const handleLogout = () => {
    setToken('');
  };

  return (
    <button onClick={handleLogout}>Logout</button>
  );
};

export default Logout;
