import React from 'react';
//import { Drawer, List, ListItem, ListItemText } from '@mui/material';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  return (
      <nav>
      <ul>
        <li component={Link} to="/dashboard">
            Escritorio
        </li>
      <li component={Link} to="/customers">
            Clientes
      </li>
      </ul>
      </nav>
    
  );
};

export default Sidebar;