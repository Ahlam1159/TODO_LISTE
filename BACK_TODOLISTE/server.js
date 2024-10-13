const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

// Connexion à MySQL
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root', // Remplace par ton utilisateur MySQL
  password: '', // Remplace par ton mot de passe MySQL
  database: 'todolist_db'
});

// Route pour récupérer toutes les tâches
app.get('/api/tasks', (req, res) => {
  const sql = 'SELECT * FROM tasks';
  db.query(sql, (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

// Route pour ajouter une tâche
app.post('/api/tasks', (req, res) => {
  const { description } = req.body;
  const sql = 'INSERT INTO tasks (description, completed) VALUES (?, false)';
  db.query(sql, [description], (err, result) => {
    if (err) throw err;
    res.json({ id: result.insertId, description, completed: false });
  });
});

// Route pour marquer une tâche comme terminée
app.put('/api/tasks/:id', (req, res) => {
  const { id } = req.params;
  const { completed } = req.body;
  const sql = 'UPDATE tasks SET completed = ? WHERE id = ?';
  db.query(sql, [completed, id], (err, result) => {
    if (err) throw err;
    res.json(result);
  });
});

// Route pour supprimer une tâche
app.delete('/api/tasks/:id', (req, res) => {
  const { id } = req.params;
  const sql = 'DELETE FROM tasks WHERE id = ?';
  db.query(sql, [id], (err, result) => {
    if (err) throw err;
    res.json(result);
  });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
