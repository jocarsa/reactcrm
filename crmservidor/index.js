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

// Helper function to get foreign key constraints
const getForeignKeys = (table) => {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT
        TABLE_NAME,
        COLUMN_NAME,
        REFERENCED_TABLE_NAME,
        REFERENCED_COLUMN_NAME
      FROM
        INFORMATION_SCHEMA.KEY_COLUMN_USAGE
      WHERE
        REFERENCED_TABLE_NAME IS NOT NULL
        AND TABLE_NAME = ?
    `;
    db.query(query, [table], (err, results) => {
      if (err) {
        return reject(err);
      }
      resolve(results);
    });
  });
};

// Helper function to get table columns
const getTableColumns = (table) => {
  return new Promise((resolve, reject) => {
    const query = `SHOW COLUMNS FROM ??`;
    db.query(query, [table], (err, results) => {
      if (err) {
        return reject(err);
      }
      resolve(results.map(row => row.Field));
    });
  });
};

// Route to get all table names with categories
app.get('/tables', async (req, res) => {
  try {
    const query = `
      SELECT 
        TABLE_NAME, 
        TABLE_COMMENT 
      FROM 
        INFORMATION_SCHEMA.TABLES 
      WHERE 
        TABLE_SCHEMA = 'crm'
    `;
    db.query(query, (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      const tables = results.map(row => ({
        name: row.TABLE_NAME,
        category: row.TABLE_COMMENT ? JSON.parse(row.TABLE_COMMENT).categoria : 'Uncategorized'
      }));
      res.json(tables);
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// Generic route to get all records from any table with joins on foreign keys
app.get('/:entity', async (req, res) => {
  const { entity } = req.params;
  
  try {
    // Get foreign keys and columns for the entity
    const [foreignKeys, columns] = await Promise.all([
      getForeignKeys(entity),
      getTableColumns(entity)
    ]);
    
    // Construct the SELECT clause
    let selectClause = columns
      .filter(column => !foreignKeys.some(fk => fk.COLUMN_NAME === column))
      .map(column => `${entity}.${column}`)
      .join(', ');
    
    const joinClauses = [];
    
    foreignKeys.forEach(fk => {
      selectClause += `, ${fk.REFERENCED_TABLE_NAME}.nombre AS ${fk.TABLE_NAME}_${fk.COLUMN_NAME}`;
      joinClauses.push(`LEFT JOIN ${fk.REFERENCED_TABLE_NAME} ON ${entity}.${fk.COLUMN_NAME} = ${fk.REFERENCED_TABLE_NAME}.${fk.REFERENCED_COLUMN_NAME}`);
    });
    
    // Construct the full SQL query
    const query = `SELECT ${selectClause} FROM ${entity} ${joinClauses.join(' ')}`;
    
    // Execute the query
    db.query(query, (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json(results);
    });
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
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
  const query = `UPDATE ?? SET ? WHERE id = ?`;
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
