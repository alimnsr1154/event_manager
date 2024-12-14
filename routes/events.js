// routes/events.js
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const router = express.Router();

const db = new sqlite3.Database('./database.db');

// Organiser Home - List Events
router.get('/organiser', (req, res) => {
    db.all(`
        SELECT * FROM events 
        ORDER BY 
            CASE WHEN status = 'draft' THEN 1 
                 WHEN status = 'published' THEN 2 
            END, 
            created_at DESC
    `, (err, events) => {
        if (err) {
            return res.status(500).send('Error retrieving events');
        }
        res.render('organiser-home', { events });
    });
});

// Create New Event
router.get('/new', (req, res) => {
    const newEvent = {
        title: 'New Event',
        description: '',
        full_price_tickets: 0,
        full_price_cost: 0,
        concession_tickets: 0,
        concession_price: 0,
        event_date: new Date().toISOString()
    };

    db.run(`
        INSERT INTO events (
            title, description, full_price_tickets, 
            full_price_cost, concession_tickets, 
            concession_price, event_date
        ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `, Object.values(newEvent), function (err) {
        if (err) {
            return res.status(500).send('Error creating new event');
        }
        res.redirect(`/events/edit/${this.lastID}`);
    });
});

// Edit Event Page
router.get('/edit/:id', (req, res) => {
    db.get('SELECT * FROM events WHERE id = ?', [req.params.id], (err, event) => {
        if (err) {
            return res.status(500).send('Error retrieving event');
        }
        res.render('organiser-event', { event });
    });
});

// Update Event
router.post('/edit/:id', (req, res) => {
    const {
        title, description,
        full_price_tickets, full_price_cost,
        concession_tickets, concession_price,
        event_date
    } = req.body;

    db.run(`
        UPDATE events 
        SET title = ?, description = ?, 
            full_price_tickets = ?, full_price_cost = ?,
            concession_tickets = ?, concession_price = ?,
            event_date = ?, last_modified = CURRENT_TIMESTAMP
        WHERE id = ?
    `, [
        title, description,
        full_price_tickets, full_price_cost,
        concession_tickets, concession_price,
        event_date, req.params.id
    ], (err) => {
        if (err) {
            return res.status(500).send('Error updating event');
        }
        res.redirect('/events/organiser');
    });
});

// Publish Event
router.post('/publish/:id', (req, res) => {
    db.run(`
        UPDATE events 
        SET status = 'published', 
            published_at = CURRENT_TIMESTAMP 
        WHERE id = ?
    `, [req.params.id], (err) => {
        if (err) {
            return res.status(500).send('Error publishing event');
        }
        res.redirect('/events/organiser');
    });
});

// Delete Event
router.post('/delete/:id', (req, res) => {
    db.run('DELETE FROM events WHERE id = ?', [req.params.id], (err) => {
        if (err) {
            return res.status(500).send('Error deleting event');
        }
        res.redirect('/events/organiser');
    });
});

// Attendee Home - List Published Events
router.get('/attendee', (req, res) => {
    db.all(`
        SELECT * FROM events 
        WHERE status = 'published' 
        ORDER BY event_date ASC
    `, (err, events) => {
        if (err) {
            return res.status(500).send('Error retrieving events');
        }
        res.render('attendee-home', { events });
    });
});

// Attendee Event Page
router.get('/attendee/:id', (req, res) => {
    db.get('SELECT * FROM events WHERE id = ?', [req.params.id], (err, event) => {
        if (err) {
            return res.status(500).send('Error retrieving event');
        }
        res.render('attendee-event', { event });
    });
});

// Book Event
router.post('/book/:id', (req, res) => {
    const {
        attendee_name,
        full_price_tickets,
        concession_tickets
    } = req.body;

    db.run(`
        INSERT INTO bookings 
        (event_id, attendee_name, full_price_tickets, concession_tickets)
        VALUES (?, ?, ?, ?)
    `, [
        req.params.id,
        attendee_name,
        full_price_tickets,
        concession_tickets
    ], (err) => {
        if (err) {
            return res.status(500).send('Error booking event');
        }
        res.redirect(`/events/attendee/${req.params.id}`);
    });
});

module.exports = router;