import React, { useState, useEffect } from 'react';
import Event from './Event';
import EventDetails from './EventDetails';

function HomePage() {
    // Define state variables
    const [events, setEvents] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [organizerId, setOrganizerId] = useState('');
    const [eventName, setEventName] = useState('');
    const [eventDescription, setEventDescription] = useState('');
    const [eventDate, setEventDate] = useState('');
    const [eventLocation, setEventLocation] = useState('');
    const [totalSeats, setTotalSeats] = useState('');
    const [remainingSeats, setRemainingSeats] = useState('');

    // Move fetchEvents function here
    async function fetchEvents() {
        try {
            const response = await fetch('http://localhost:3000/api/events');
            const data = await response.json();
            setEvents(data);
        } catch (error) {
            console.error('Failed to fetch events:', error);
        }
    }

    // Fetch events data from API endpoint using useEffect
    useEffect(() => {
        fetchEvents();
    }, []);

    // Function to handle form submission
    const handleCreateEvent = async (e) => {
        e.preventDefault();

        // Create a new event object
        const newEvent = {
            organizer_id: organizerId,
            event_name: eventName,
            event_description: eventDescription,
            event_date: eventDate,
            event_location: eventLocation,
            total_seats: totalSeats,
            remaining_seats: remainingSeats,
        };

        try {
            // Make a POST request to the API to create the event
            const response = await fetch('http://localhost:3000/api/createEvent', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newEvent),
            });

            if (response.ok) {
                // Successfully created the event
                console.log('Event created successfully');
                
                // Reset the form inputs
                setOrganizerId('');
                setEventName('');
                setEventDescription('');
                setEventDate('');
                setEventLocation('');
                setTotalSeats('');
                setRemainingSeats('');

                // Refresh the events list by calling fetchEvents
                fetchEvents();
            } else {
                // Handle create event error
                console.error('Failed to create event');
            }
        } catch (error) {
            console.error('Failed to create event:', error);
        }
    };

    return (
        <div className="container">
            <div className="home-page">
                <a href='/'><h1>Event Master</h1></a>
                
                {/* Only display the search bar if there is no event selected */}
                {selectedEvent === null && (
                    <div className="search-bar">
                        <input
                            type="text"
                            placeholder="Search for events..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                )}

                {/* Check if an event is selected */}
                {selectedEvent ? (
                    <EventDetails event={selectedEvent} />
                ) : (
                    <>
                        <Event events={events} searchTerm={searchTerm} onEventClick={setSelectedEvent} />

                        {/* Create Event form */}
                        <form onSubmit={handleCreateEvent} className="create-event-form">
                            <h3 style={{fontSize: '48px'}}>Create Event</h3>
                            
                            <div>
                                <label>Organizer ID:</label>
                                <input
                                    type="number"
                                    value={organizerId}
                                    onChange={(e) => setOrganizerId(e.target.value)}
                                    required
                                />
                            </div>
                            
                            <div>
                                <label>Event Name:</label>
                                <input
                                    type="text"
                                    value={eventName}
                                    onChange={(e) => setEventName(e.target.value)}
                                    required
                                />
                            </div>

                            <div>
                                <label>Event Description:</label>
                                <textarea
                                    value={eventDescription}
                                    onChange={(e) => setEventDescription(e.target.value)}
                                    required
                                />
                            </div>

                            <div>
                                <label>Event Date:</label>
                                <input
                                    type="date"
                                    value={eventDate}
                                    onChange={(e) => setEventDate(e.target.value)}
                                    required
                                />
                            </div>

                            <div>
                                <label>Event Location:</label>
                                <input
                                    type="text"
                                    value={eventLocation}
                                    onChange={(e) => setEventLocation(e.target.value)}
                                    required
                                />
                            </div>

                            <div>
                                <label>Total Seats:</label>
                                <input
                                    type="number"
                                    value={totalSeats}
                                    onChange={(e) => setTotalSeats(e.target.value)}
                                    required
                                />
                            </div>

                            <div>
                                <label>Remaining Seats:</label>
                                <input
                                    type="number"
                                    value={remainingSeats}
                                    onChange={(e) => setRemainingSeats(e.target.value)}
                                    required
                                />
                            </div>

                            <button type="submit">Create Event</button>
                        </form>
                    </>
                )}
            </div>
        </div>
    );
}

export default HomePage;
