const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');

// Create an Express app
const app = express();

// Enable CORS
app.use(cors());
// Middleware to parse JSON request bodies
app.use(express.json());

// Configure the MySQL connection pool
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'password111',
    database: 'dbms2',
    connectionLimit: 10
});

// Define an API endpoint to fetch events data
app.get('/api/events', async (req, res) => {
    try {
        // Execute a query to retrieve events data
        const [results] = await pool.query('SELECT * FROM events');
        // Send the results as a JSON response
        res.json(results);
    } catch (error) {
        console.error('Failed to fetch events:', error);
        res.status(500).send('Server error');
    }
});

// Define an API endpoint to fetch attendees data
app.get('/api/attendees', async (req, res) => {
    try {
        // Execute a query to retrieve attendees data
        const [results] = await pool.query('SELECT * FROM Attendees');
        // Send the results as a JSON response
        res.json(results);
    } catch (error) {
        console.error('Failed to fetch attendees:', error);
        res.status(500).send('Server error');
    }
});

// Define an API endpoint to fetch attendees data for a specific event
app.get('/api/attendees/:eventId', async (req, res) => {
    const eventId = req.params.eventId; // Retrieve the event ID from the URL parameter

    try {
        // Execute the query with the event ID as a parameter
        const [results] = await pool.query('SELECT * FROM Attendees WHERE event_id = ?', [eventId]);
        // Send the results as a JSON response
        res.json(results);
    } catch (error) {
        console.error('Failed to fetch attendees:', error);
        res.status(500).send('Server error');
    }
});

// Define an API endpoint to register an attendee
app.post('/api/register', async (req, res) => {
    const { attendee_name, attendee_email, event_id } = req.body;

    // Insert query to register an attendee
    const query = 'INSERT INTO Attendees (attendee_name, attendee_email, event_id) VALUES (?, ?, ?)';

    try {
        // Execute the query and await the result
        await pool.query(query, [attendee_name, attendee_email, event_id]);

        // Successfully registered the attendee
        console.log('Attendee registered successfully');
        res.status(201).send('Attendee registered successfully');
    } catch (error) {
        // Handle registration error
        console.error('Failed to register attendee:', error);
        res.status(500).send('Failed to register attendee');
    }
});

// API endpoint to unregister an attendee
app.delete('/api/attendees/:attendeeId', async (req, res) => {
    const attendeeId = req.params.attendeeId; // Retrieve the attendee ID from the URL parameter

    try {
        // Execute a DELETE query to remove the attendee with the specified ID
        const query = 'DELETE FROM Attendees WHERE attendee_id = ?';
        const [result] = await pool.query(query, [attendeeId]);

        // Check if any rows were affected (i.e., if the attendee was deleted)
        if (result.affectedRows > 0) {
            console.log(`Attendee with ID ${attendeeId} unregistered successfully`);
            res.status(200).send(`Attendee with ID ${attendeeId} unregistered successfully`);
        } else {
            console.error(`Attendee with ID ${attendeeId} not found`);
            res.status(404).send(`Attendee with ID ${attendeeId} not found`);
        }
    } catch (error) {
        console.error(`Failed to unregister attendee with ID ${attendeeId}:`, error);
        res.status(500).send(`Failed to unregister attendee with ID ${attendeeId}`);
    }
});

// Define an API endpoint to create an event
app.post('/api/createEvent', async (req, res) => {
    // Extract event data from the request body
    const {
        organizer_id,
        event_name,
        event_description,
        event_date,
        event_location,
        total_seats,
        remaining_seats
    } = req.body;

    // Create an SQL query to insert the event into the database
    const query = `
        INSERT INTO Events (
            organizer_id,
            event_name,
            event_description,
            event_date,
            event_location,
            total_seats,
            remaining_seats
        ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    try {
        // Execute the query with the provided data
        await pool.query(query, [
            organizer_id,
            event_name,
            event_description,
            event_date,
            event_location,
            total_seats,
            remaining_seats
        ]);

        // Successfully created the event
        console.log('Event created successfully');
        res.status(201).json({ message: 'Event created successfully' });
    } catch (error) {
        // Handle error
        console.error('Failed to create event:', error);
        res.status(500).json({ message: 'Failed to create event' });
    }
});

// Endpoint to find organizers by event ID
app.get('/api/searchOrganisersWithEventId/:eventId', async (req, res) => {
    const { eventId } = req.params;
    console.log("searchOrganisersWithEventId", eventId)

    try {
        // Define the query to find organizers by event ID
        const query = `
            SELECT o.organizer_id, o.organizer_name
            FROM Organizers o
            JOIN Events e ON o.organizer_id = e.organizer_id
            WHERE e.event_id = ?;
        `;

        // Execute the query
        const [results] = await pool.query(query, [eventId]);
        console.log(results);
        // Send the results as a JSON response
        res.json(results);
    } catch (error) {
        console.error('Error querying database:', error);
        res.status(500).json({ error: 'Failed to fetch organizers' });
    }
});

// Endpoint to find events registered by attendee ID
app.get('/api/searchEventWithAttendeeId/:attendeeId', async (req, res) => {
    const { attendeeId } = req.params;
    console.log("searchEventWithAttendeeId", attendeeId);

    try {
        // Define the query to find events registered by attendee ID
        const query = `
            SELECT e.event_id, e.event_name, e.event_date
            FROM Events e
            INNER JOIN Attendees a ON e.event_id = a.event_id
            WHERE a.attendee_id = ?;
        `;

        // Execute the query
        const [results] = await pool.query(query, [attendeeId]);
        console.log(results);
        // Send the results as a JSON response
        res.json(results);
    } catch (error) {
        console.error('Error querying database:', error);
        res.status(500).json({ error: 'Failed to fetch events' });
    }
});


// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
