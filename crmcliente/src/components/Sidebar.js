import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  return (
    <nav>
        <Link to="/dashboard">Escritorio</Link>
        <Link to="/clientes">Clientes</Link>
    </nav>
  );
};

export default Sidebar;