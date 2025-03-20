const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

// Middleware per il parsing del JSON
app.use(bodyParser.json());

// Connessione al database SQLite
const db = new sqlite3.Database('./database.db', (err) => {
    if (err) {
        console.error('Errore nella connessione al database:', err.message);
    } else {
        console.log('Connessione a SQLite riuscita');
    }
});

// Creazione delle tabelle se non esistono
db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS macchine (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT NOT NULL
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS guasti (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        macchina_id INTEGER,
        descrizione TEXT NOT NULL,
        FOREIGN KEY (macchina_id) REFERENCES macchine(id) ON DELETE CASCADE
    )`);
});

// **1. Aggiungere una macchina**
app.post('/api/macchine', (req, res) => {
    const { nome } = req.body;
    if (!nome) {
        return res.status(400).json({ error: 'Il nome è obbligatorio' });
    }
    db.run(`INSERT INTO macchine (nome) VALUES (?)`, [nome], function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ id: this.lastID, nome });
    });
});

// **2. Ottenere tutte le macchine**
app.get('/api/macchine', (req, res) => {
    db.all(`SELECT * FROM macchine`, [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
});

// **3. Eliminare una macchina e i suoi guasti**
app.delete('/api/macchine/:id', (req, res) => {
    const { id } = req.params;
    db.run(`DELETE FROM macchine WHERE id = ?`, [id], function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: 'Macchina eliminata con successo' });
    });
});

// **4. Aggiungere un guasto a una macchina**
app.post('/api/guasti', (req, res) => {
    const { macchina_id, descrizione } = req.body;
    if (!macchina_id || !descrizione) {
        return res.status(400).json({ error: 'macchina_id e descrizione sono obbligatori' });
    }
    db.run(`INSERT INTO guasti (macchina_id, descrizione) VALUES (?, ?)`, [macchina_id, descrizione], function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ id: this.lastID, macchina_id, descrizione });
    });
});

// **5. Ottenere tutti i guasti di una macchina**
app.get('/api/macchine/:id/guasti', (req, res) => {
    const { id } = req.params;
    db.all(`SELECT * FROM guasti WHERE macchina_id = ?`, [id], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
});

// **6. Eliminare un guasto**
app.delete('/api/guasti/:id', (req, res) => {
    const { id } = req.params;
    db.run(`DELETE FROM guasti WHERE id = ?`, [id], function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: 'Guasto eliminato con successo' });
    });
});

// **Avvio del server**
app.listen(PORT, () => {
    console.log(`Server in ascolto su http://localhost:${PORT}`);
});
