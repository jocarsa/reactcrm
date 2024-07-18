// App.js
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import EntityList from './components/EntityList';
import EntityDetail from './components/EntityDetail';
import axios from 'axios';
import './App.css';

const App = () => {
  const [tables, setTables] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/tables')
      .then(response => setTables(response.data))
      .catch(error => console.error(error));
  }, []);

  return (
    <Router>
      <Navbar />
      <main>
        <Sidebar tables={tables} />
        <section>
          <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            {tables.map(table => (
              <Route key={table.name} path={`/${table.name}`} element={<EntityList entity={table.name} />} />
            ))}
            {tables.map(table => (
              <Route key={table.name} path={`/${table.name}/:id`} element={<EntityDetail entity={table.name} />} />
            ))}
          </Routes>
        </section>
      </main>
    </Router>
  );
};

export default App;
