const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(__dirname)); // serve static files from project root

// in-memory database; swap with file if you want persistence
const db = new sqlite3.Database('app.db');

// create users and reports tables
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY,
      username TEXT UNIQUE,
      password TEXT
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS reports (
      id INTEGER PRIMARY KEY,
      name TEXT,
      problemType TEXT,
      description TEXT,
      status TEXT DEFAULT 'Pending',
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
});

// registration endpoint
app.post('/api/register', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ success: false, message: 'Username and password required' });
  }

  db.run(
    'INSERT INTO users (username, password) VALUES (?, ?)',
    [username, password],
    function(err) {
      if (err) {
        if (err.message.includes('UNIQUE')) {
          return res.status(409).json({ success: false, message: 'Username already taken' });
        }
        return res.status(500).json({ success: false, message: err.message });
      }
      res.json({ success: true });
    }
  );
});

// login endpoint
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  db.get(
    'SELECT * FROM users WHERE username = ? AND password = ?',
    [username, password],
    (err, row) => {
      if (err) return res.status(500).json({ success: false, message: err.message });
      if (row) {
        res.json({ success: true });
      } else {
        res.status(401).json({ success: false, message: 'Invalid credentials' });
      }
    }
  );
});

// report endpoints
app.post('/api/reports', (req, res) => {
  const { name, problem, description } = req.body;
  db.run(
    'INSERT INTO reports (name, problemType, description) VALUES (?, ?, ?)',
    [name, problem, description],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ success: true });
    }
  );
});

app.get('/api/reports', (req, res) => {
  db.all('SELECT * FROM reports ORDER BY timestamp DESC', (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
