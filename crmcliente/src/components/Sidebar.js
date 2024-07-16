import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  return (
    <nav>
        <Link to="/dashboard">Escritorio</Link>
        <Link to="/clientes">Clientes</Link>
        <Link to="/productos">Productos</Link>
    </nav>
  );
};

export default Sidebar;