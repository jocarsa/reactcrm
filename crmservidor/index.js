const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const cors = require('cors');

// Create an instance of Express
const app = express();
const PORT = process.env.PORT || 5000;  // Change the port to 5000

app.use(cors());

// Middleware
app.use(bodyParser.json());

// Database connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'crm',
  password: 'crm',
  database: 'crm'
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err.stack);
    return;
  }
  console.log('Connected to the database.');
});

// Routes
app.get('/', (req, res) => {
  res.send('Bienvenido al servidor');
});

// Get all customers
app.get('/clientes', (req, res) => {
  const query = 'SELECT Identificador AS id, nombre, email, telefono FROM clientes';
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

// Get a specific customer by id
app.get('/clientes/:id', (req, res) => {
  const { id } = req.params;
  const query = 'SELECT Identificador AS id, nombre, email, telefono FROM clientes WHERE Identificador = ?';
  db.query(query, [id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

// Get a specific customer by id
app.get('/deleteclientes/:id', (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM clientes WHERE Identificador = ?';
  db.query(query, [id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

// Tomar todos los productos
app.get('/productos', (req, res) => {
  const query = 'SELECT Identificador AS id, nombre, descripcion, precio FROM productos';
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

// Insert a new customer
app.post('/clientes', (req, res) => {
  const { nombre, email, telefono } = req.body;
  const query = 'INSERT INTO clientes (nombre, email, telefono) VALUES (?, ?, ?)';
  db.query(query, [nombre, email, telefono], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: 'Customer added successfully', id: results.insertId });
  });
});

// Update a customer by id
app.put('/clientes/:id', (req, res) => {
  const { id } = req.params;
  const { nombre, email, telefono } = req.body;
  const query = 'UPDATE clientes SET nombre = ?, email = ?, telefono = ? WHERE Identificador = ?';
  db.query(query, [nombre, email, telefono, id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: 'Customer updated successfully' });
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
