// components/Sidebar.js
import React from 'react';
import { Link } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = ({ tables }) => {
  // Group tables by category
  const categories = tables.reduce((acc, table) => {
    const { category, name } = table;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(name);
    return acc;
  }, {});

  return (
    <nav>
      <Link to="/dashboard">Dashboard</Link>
      {Object.keys(categories).map(category => (
        <div key={category}>
          <h3>{category.charAt(0).toUpperCase() + category.slice(1)}</h3>
          <ul>
            {categories[category].map(table => (
              <li key={table}>
                <Link to={`/${table}`}>
                  {table.charAt(0).toUpperCase() + table.slice(1)}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </nav>
  );
};

export default Sidebar;
