// components/Sidebar.js
import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = ({ tables }) => {
  return (
    <nav>
      <Link to="/dashboard">Dashboard</Link>
      {tables.map(table => (
        <Link key={table} to={`/${table}`}>
          {table.charAt(0).toUpperCase() + table.slice(1)}
        </Link>
      ))}
    </nav>
  );
};

export default Sidebar;
