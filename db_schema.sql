-- db_schema.sql
PRAGMA foreign_keys = ON;

-- Site Settings Table
CREATE TABLE IF NOT EXISTS site_settings (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT NOT NULL
);

-- Events Table
CREATE TABLE IF NOT EXISTS events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    full_price_tickets INTEGER NOT NULL,
    full_price_cost REAL NOT NULL,
    concession_tickets INTEGER NOT NULL,
    concession_price REAL NOT NULL,
    status TEXT CHECK(status IN ('draft', 'published')) DEFAULT 'draft',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    published_at DATETIME,
    last_modified DATETIME DEFAULT CURRENT_TIMESTAMP,
    event_date DATETIME NOT NULL
);

-- Bookings Table
CREATE TABLE IF NOT EXISTS bookings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    event_id INTEGER NOT NULL,
    attendee_name TEXT NOT NULL,
    full_price_tickets INTEGER NOT NULL,
    concession_tickets INTEGER NOT NULL,
    booking_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
);

-- Initial Site Settings
INSERT OR REPLACE INTO site_settings (id, name, description) 
VALUES (1, 'Event Manager', 'Organize and manage your events easily');