import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import EntityList from './components/EntityList';
import EntityDetail from './components/EntityDetail';
import Login from './components/Login';
import Logout from './components/Logout';
import axios from 'axios';
import './App.css';

const App = () => {
  const [tables, setTables] = useState([]);
  const [token, setToken] = useState(localStorage.getItem('token') || '');

  useEffect(() => {
    if (token) {
      axios.get('http://localhost:5000/tables', {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(response => setTables(response.data))
        .catch(error => console.error(error));
    }
  }, [token]);

  const setTokenAndStore = (token) => {
    setToken(token);
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  };

  return (
    <Router>
      <Navbar />
      <main>
        {token ? (
          <>
            <Sidebar tables={tables} />
            <Logout setToken={setTokenAndStore} />
            <section>
              <Routes>
                <Route path="/dashboard" element={<Dashboard />} />
                {tables.map(table => (
                  <Route key={table.name} path={`/${table.name}`} element={<EntityList entity={table.name} />} />
                ))}
                {tables.map(table => (
                  <Route key={table.name} path={`/${table.name}/:id`} element={<EntityDetail entity={table.name} />} />
                ))}
                <Route path="*" element={<Navigate to="/dashboard" />} />
              </Routes>
            </section>
          </>
        ) : (
          <Routes>
            <Route path="/login" element={<Login setToken={setTokenAndStore} />} />
            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        )}
      </main>
    </Router>
  );
};

export default App;
