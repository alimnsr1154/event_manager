// routes/main.js
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const router = express.Router();

const db = new sqlite3.Database('./database.db');

// Main Home Page
router.get('/', (req, res) => {
    res.render('main-home');
});

// Site Settings Retrieval
router.get('/site-settings', (req, res) => {
    db.get('SELECT * FROM site_settings WHERE id = 1', (err, settings) => {
        if (err) {
            return res.status(500).send('Error retrieving site settings');
        }
        res.render('site-settings', { settings });
    });
});

// Site Settings Update
router.post('/site-settings', (req, res) => {
    const { name, description } = req.body;

    db.run('UPDATE site_settings SET name = ?, description = ? WHERE id = 1',
        [name, description],
        (err) => {
            if (err) {
                return res.status(500).send('Error updating site settings');
            }
            res.redirect('/organiser');
        }
    );
});

module.exports = router;