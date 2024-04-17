// Event.jsx
import React, { useState } from 'react';

function Event({ events, searchTerm, onEventClick }) {
    const filteredEvents = events.filter(event =>
        event.event_name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="event-list">
            {filteredEvents.map(event => (
                <div key={event.event_id} className="event-item" onClick={() => onEventClick(event)}>
                    <h2>{event.event_name}</h2>
                    <p>{event.event_description}</p>
                    <p>Date: {event.event_date}</p>
                    <p>Location: {event.event_location}</p>
                    <p>Seats remaining: {event.remaining_seats}</p>
                </div>
            ))}
        </div>
    );
}

export default Event;
