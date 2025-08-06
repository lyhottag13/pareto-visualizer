import pool from './src/db.js';
import port from './src/port.js';
import NUMBER_OF_CHECKS from './public/constants/NUMBER_OF_CHECKS.js';

// START BOILERPLATE.

import path from 'path';
import express from 'express';
import { fileURLToPath } from 'url';
const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Dependencies for the app to read user input and to return JSONs.
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

app.listen(port, () => {
    console.log(`App running on port ${port}`);
});

// END BOILERPLATE.

// Shows the main app screen.
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'app.html'));
});

// Selects all the rows with at least one fail in the table and returns them. 
app.get('/api/select', async (req, res) => {
    let SQLstring = 'SELECT * FROM qa1 WHERE s1 = 0';
    for (let i = 1; i < NUMBER_OF_CHECKS; i++) {
        SQLstring += ` OR s${i + 1} = 0`
    }
    SQLstring += ';';
    const [rows] = await pool.query(SQLstring);
    res.json(rows);
});
