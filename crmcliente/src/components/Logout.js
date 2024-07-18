// components/Logout.js
import React from 'react';
import './Logout.css';

const Logout = ({ setToken }) => {
  const handleLogout = () => {
    setToken('');
  };

  return (
    <button className="botonlogout" onClick={handleLogout}>🔒</button>
  );
};

export default Logout;
