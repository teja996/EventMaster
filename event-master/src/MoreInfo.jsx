import React, { useState } from 'react';

function MoreInfo() {
    // State variables for input fields
    const [eventId, setEventId] = useState('');
    const [attendeeId, setAttendeeId] = useState('');

    // State variables to store fetched data
    const [organizers, setOrganizers] = useState([]);
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Function to handle fetching organizers by event ID
    const fetchOrganizersByEventId = async () => {
        try {
            setLoading(true);
            const response = await fetch(`http://localhost:3000/api/searchOrganisersWithEventId/${eventId}`);
            if (!response.ok) {
                throw new Error('Failed to fetch organizers');
            }
            const data = await response.json();
            setOrganizers(data);
            setLoading(false);
        } catch (error) {
            setError('Failed to fetch organizers');
            setLoading(false);
            console.error(error);
        }
    };

    // Function to handle fetching events by attendee ID
    const fetchEventsByAttendeeId = async () => {
        try {
            setLoading(true);
            const response = await fetch(`http://localhost:3000/api/searchEventWithAttendeeId/${attendeeId}`);
            if (!response.ok) {
                throw new Error('Failed to fetch events');
            }
            const data = await response.json();
            setEvents(data);
            setLoading(false);
        } catch (error) {
            setError('Failed to fetch events');
            setLoading(false);
            console.error(error);
        }
    };

    return (
        <div style={{ padding: '20px' }}>
            <h2 style={{ marginBottom: '10px', fontSize: '40px' }}>Finding organizers by eventId</h2>
            <input
                type="text"
                value={eventId}
                onChange={(e) => setEventId(e.target.value)}
                placeholder="Enter event ID"
                style={{ marginBottom: '10px', padding: '10px', fontSize: '20px' }}
            />
            <button
                onClick={fetchOrganizersByEventId}
                style={{ padding: '10px 20px', marginBottom: '10px', fontSize: '16px' }}
            >
                Search
            </button>

            {/* Loading and error handling */}
            {loading && <p style={{ fontSize: '16px' }}>Loading...</p>}
            {error && <p style={{ color: 'red', fontSize: '16px' }}>{error}</p>}

            {/* Display organizers */}
            <div>
                {organizers.map((organizer, index) => (
                    <div key={index} style={{ marginBottom: '10px', fontSize: '20px' }}>
                        <p>Organizer ID: {organizer.organizer_id}</p>
                        <p>Name: {organizer.organizer_name}</p>
                    </div>
                ))}
            </div>

            <h2 style={{ marginBottom: '10px', fontSize: '40px' }}>Finding events you registered by attendeeId</h2>
            <input
                type="text"
                value={attendeeId}
                onChange={(e) => setAttendeeId(e.target.value)}
                placeholder="Enter attendee ID"
                style={{ marginBottom: '10px', padding: '10px', fontSize: '20px' }}
            />
            <button
                onClick={fetchEventsByAttendeeId}
                style={{ padding: '10px 20px', marginBottom: '10px', fontSize: '16px' }}
            >
                Search
            </button>

            {/* Loading and error handling */}
            {loading && <p style={{ fontSize: '16px' }}>Loading...</p>}
            {error && <p style={{ color: 'red', fontSize: '16px' }}>{error}</p>}

            {/* Display events */}
            <div>
                {events.map((event, index) => (
                    <div key={index} style={{ marginBottom: '10px', fontSize: '20px' }}>
                        <p>Event Name: {event.event_name}</p>
                        <p>Future Date: {event.event_date}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default MoreInfo;
