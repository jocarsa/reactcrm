import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import CustomerList from './components/ClientesLista';
import ProductosLista from './components/ProductosLista';
import CustomerDetails from './components/ClientesDetalle';
import CustomerForm from './components/ClientesFormulario';
import DeleteCustomerDetails from './components/DeleteCustomerDetails';
import axios from 'axios';
import './App.css';

const DynamicTableComponent = ({ table }) => {
  // Placeholder for actual table component
  return <div>{table} data</div>;
};

function App() {
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
            <Route path="/clientes" element={<CustomerList />} />
            <Route path="/productos" element={<ProductosLista />} />
            <Route path="/customers/new" element={<CustomerForm />} />
            <Route path="/customers/:id" element={<CustomerDetails />} />
            <Route path="/deletecustomers/:id" element={<DeleteCustomerDetails />} />
            {tables.map(table => (
              <Route
                key={table}
                path={`/${table}`}
                element={<DynamicTableComponent table={table} />}
              />
            ))}
          </Routes>
        </section>
      </main>
    </Router>
  );
}

export default App;
