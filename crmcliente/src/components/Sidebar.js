import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Sidebar = () => {
  const [tables, setTables] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/tables')
      .then(response => setTables(response.data))
      .catch(error => console.error(error));
  }, []);

  return (
    <nav>
      <Link to="/dashboard">Escritorio</Link>
      {tables.map(table => (
        <Link key={table} to={`/${table}`}>
          {table.charAt(0).toUpperCase() + table.slice(1)}
        </Link>
      ))}
    </nav>
  );
};

export default Sidebar;
