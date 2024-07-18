import React from 'react';
import Logout from './Logout';
import './Navbar.css'

const Navbar = ({ setTokenAndStore }) => {
  return (
    <div className="barra">
      <div className="herramientas">
        <h6 className="tituloapp">Aplicación CRM</h6>
        <Logout setToken={setTokenAndStore} />
      </div>
    </div>
  );
};

export default Navbar;
