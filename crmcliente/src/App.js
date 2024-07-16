import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import CustomerList from './components/ClientesLista';
import ProductosLista from './components/ProductosLista';
import CustomerDetails from './components/ClientesDetalle';
import DeleteCustomerDetails from './components/DeleteCustomerDetails';
import './App.css';

function App() {
  return (
    <Router>
      <Navbar />
      <main>
        <Sidebar />
        <section>
          <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/clientes" element={<CustomerList />} />
            <Route path="/productos" element={<ProductosLista />} />
            <Route path="/customers/:id" element={<CustomerDetails />} />
            <Route path="/deletecustomers/:id" element={<DeleteCustomerDetails />} />
          </Routes>
        </section>
      </main>
    </Router>
  );
}

export default App;
