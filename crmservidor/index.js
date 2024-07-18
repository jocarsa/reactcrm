const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const cors = require('cors');
const jwt = require('jsonwebtoken');

// Create an instance of Express
const app = express();
const PORT = process.env.PORT || 5000;
const SECRET_KEY = 'your_secret_key'; // Change this to your actual secret key

app.use(cors());
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

// Middleware to protect routes
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.sendStatus(401); // No token provided
  }

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) {
      return res.sendStatus(403); // Invalid token
    }
    req.user = user;
    next();
  });
};

// Login endpoint
app.post('/login', (req, res) => {
  const { usuario, contrasena } = req.body;
  console.log('Received credentials:', { usuario, contrasena });
  const query = 'SELECT * FROM usuarios WHERE usuario = ? AND contrasena = ?';

  db.query(query, [usuario, contrasena], (err, results) => {
    if (err) {
      console.error('Database query error:', err);
      return res.status(500).json({ error: err.message });
    }
    if (results.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ usuario: results[0].usuario }, SECRET_KEY, { expiresIn: '1h' });
    res.json({ token });
  });
});

// Helper function to get table schema dynamically
const getTableSchema = (table) => {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT COLUMN_NAME, DATA_TYPE
      FROM INFORMATION_SCHEMA.COLUMNS
      WHERE TABLE_SCHEMA = 'crm' AND TABLE_NAME = ?
    `;
    db.query(query, [table], (err, results) => {
      if (err) {
        return reject(err);
      }
      const schema = {};
      results.forEach(row => {
        schema[row.COLUMN_NAME] = row.DATA_TYPE;
      });
      resolve(schema);
    });
  });
};

// Route to get schema for an entity
app.get('/schema/:entity', authenticateToken, async (req, res) => {
  const { entity } = req.params;
  try {
    const schema = await getTableSchema(entity);
    res.json(schema);
  } catch (error) {
    console.error('Error fetching schema:', error);
    res.status(500).json({ error: error.message });
  }
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
        console.error('Error fetching foreign keys:', err);
        return reject(err);
      }
      resolve(results);
    });
  });
};

// Route to get foreign keys for a table
app.get('/foreignkeys/:entity', authenticateToken, async (req, res) => {
  const { entity } = req.params;
  try {
    const foreignKeys = await getForeignKeys(entity);
    res.json(foreignKeys);
  } catch (error) {
    console.error('Error in /foreignkeys/:entity route:', error);
    res.status(500).json({ error: error.message });
  }
});

// Route to get related data for a foreign key field
app.get('/related/:entity/:foreignKey', authenticateToken, async (req, res) => {
  const { entity, foreignKey } = req.params;
  const referencedTableQuery = `
    SELECT REFERENCED_TABLE_NAME, REFERENCED_COLUMN_NAME
    FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE
    WHERE TABLE_SCHEMA = 'crm' AND TABLE_NAME = ? AND COLUMN_NAME = ?
  `;

  db.query(referencedTableQuery, [entity, foreignKey], (err, results) => {
    if (err) {
      console.error('Error fetching referenced table:', err);
      return res.status(500).json({ error: err.message });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: 'Foreign key not found' });
    }

    const referencedTable = results[0].REFERENCED_TABLE_NAME;
    const referencedColumn = results[0].REFERENCED_COLUMN_NAME;
    const selectQuery = `SELECT ${referencedColumn} AS id, nombre FROM ${referencedTable}`;

    db.query(selectQuery, (err, results) => {
      if (err) {
        console.error('Error fetching related data:', err);
        return res.status(500).json({ error: err.message });
      }
      res.json(results);
    });
  });
});

// Route to get all table names with categories
app.get('/tables', authenticateToken, async (req, res) => {
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
        console.error('Error fetching tables:', err);
        return res.status(500).json({ error: err.message });
      }
      const tables = results.map(row => ({
        name: row.TABLE_NAME,
        category: row.TABLE_COMMENT ? JSON.parse(row.TABLE_COMMENT).categoria : 'Uncategorized'
      }));
      res.json(tables);
    });
  } catch (error) {
    console.error('Error in /tables route:', error);
    res.status(500).json({ error: error.message });
  }
});

// Helper function to get table columns
const getTableColumns = (table) => {
  return new Promise((resolve, reject) => {
    const query = `SHOW COLUMNS FROM ??`;
    db.query(query, [table], (err, results) => {
      if (err) {
        console.error('Error fetching table columns:', err);
        return reject(err);
      }
      resolve(results.map(row => row.Field));
    });
  });
};

// Generic route to get all records from any table with joins on foreign keys
app.get('/:entity', authenticateToken, async (req, res) => {
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
        console.error('Error executing query:', err);
        return res.status(500).json({ error: err.message });
      }
      res.json(results);
    });

  } catch (error) {
    console.error('Error fetching records:', error);
    res.status(500).json({ error: error.message });
  }
});

// Generic route to get a specific record by id from any table with joins on foreign keys
app.get('/:entity/:id', authenticateToken, async (req, res) => {
  const { entity, id } = req.params;

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
    const query = `SELECT ${selectClause} FROM ${entity} ${joinClauses.join(' ')} WHERE ${entity}.id = ?`;

    // Execute the query
    db.query(query, [id], (err, results) => {
      if (err) {
        console.error('Error executing query:', err);
        return res.status(500).json({ error: err.message });
      }
      res.json(results);
    });

  } catch (error) {
    console.error('Error fetching record:', error);
    res.status(500).json({ error: error.message });
  }
});

// Generic route to delete a specific record by id from any table
app.delete('/:entity/:id', authenticateToken, (req, res) => {
  const { entity, id } = req.params;
  const query = `DELETE FROM ?? WHERE id = ?`;
  db.query(query, [entity, id], (err, results) => {
    if (err) {
      console.error('Error deleting record:', err);
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: 'Record deleted successfully' });
  });
});

// Generic route to insert a new record into any table
app.post('/:entity', authenticateToken, (req, res) => {
  const { entity } = req.params;
  const data = req.body;
  delete data.id; // Remove the id from the data before insertion
  console.log('Inserting data into', entity, ':', data);
  const query = `INSERT INTO ?? SET ?`;
    console.log(query);
  db.query(query, [entity, data], (err, results) => {
    if (err) {
      console.error('Database insert error:', err);
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: 'Record added successfully', id: results.insertId });
  });
});

// Generic route to update a specific record by id in any table
app.put('/:entity/:id', authenticateToken, (req, res) => {
  const { entity, id } = req.params;
  const data = req.body;
  delete data.id; // Remove the id from the data before updating
  const query = `UPDATE ?? SET ? WHERE id = ?`;
  db.query(query, [entity, data, id], (err, results) => {
    if (err) {
      console.error('Error updating record:', err);
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: 'Record updated successfully' });
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
