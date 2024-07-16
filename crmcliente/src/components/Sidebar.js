import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  return (
    <nav>
      <ul>
        <li>
          <Link to="/dashboard">Escritorio</Link>
        </li>
        <li>
          <Link to="/clientes">Clientes</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Sidebar;