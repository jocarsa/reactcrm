import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import CustomerList from './components/ClientesLista';
import CustomerDetails from './components/ClientesDetalle';
import CustomerForm from './components/ClientesFormulario';



function App() {
  return (
    <Router>
      <Navbar />
      <Sidebar />
      <section>
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/clientes" element={<CustomerList />} />
          <Route path="/customers/new" element={<CustomerForm />} />
          <Route path="/customers/:id" element={<CustomerDetails />} />
        </Routes>
      </section>
    </Router>
  );
}

export default App;
