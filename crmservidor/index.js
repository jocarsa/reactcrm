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

// Route to get all table names
app.get('/tables', (req, res) => {
  const query = 'SHOW TABLES';
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    const tables = results.map(row => Object.values(row)[0]);
    res.json(tables);
  });
});

// Generic route to get all records from any table
app.get('/:entity', (req, res) => {
  const { entity } = req.params;
  const query = `SELECT * FROM ??`;
  db.query(query, [entity], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

// Generic route to get a specific record by id from any table
app.get('/:entity/:id', (req, res) => {
  const { entity, id } = req.params;
  const query = `SELECT * FROM ?? WHERE id = ?`;
  db.query(query, [entity, id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

// Generic route to delete a specific record by id from any table
app.delete('/:entity/:id', (req, res) => {
  const { entity, id } = req.params;
  const query = `DELETE FROM ?? WHERE id = ?`;
  db.query(query, [entity, id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: 'Record deleted successfully' });
  });
});

// Generic route to insert a new record into any table
app.post('/:entity', (req, res) => {
  const { entity } = req.params;
  const data = req.body;
  const query = `INSERT INTO ?? SET ?`;
  db.query(query, [entity, data], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: 'Record added successfully', id: results.insertId });
  });
});

// Generic route to update a specific record by id in any table
app.put('/:entity/:id', (req, res) => {
  const { entity, id } = req.params;
  const data = req.body;
  const query = `UPDATE ${entity} SET ${data} WHERE id = ${id}`;
  db.query(query, [entity, data, id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: 'Record updated successfully' });
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
