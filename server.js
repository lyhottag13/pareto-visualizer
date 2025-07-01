import pool from './db.js';

import path from 'path';
import express from 'express';
import { fileURLToPath } from 'url';
const app = express();
const PORT = 3001;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Dependencies for the app to read user input and to return JSONs.
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

app.listen(PORT, () => {
    console.log(`App running on port ${PORT}`);
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'app.html'));
});

// Sends all the rows in the qa1 database. 
app.get('/api/select', async (req, res) => {
    const SQLstring = 'SELECT * FROM qa1';
    const [rows] = await pool.query(SQLstring);
    res.json(rows);
})