import React, { useState, useEffect } from 'react';

function EventDetails({ event }) {
    // State variables to manage form inputs and attendees data
    const [attendeeName, setAttendeeName] = useState('');
    const [attendeeEmail, setAttendeeEmail] = useState('');
    const [attendees, setAttendees] = useState([]); // Define attendees state

    // Function to handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Create a new attendee object
        const newAttendee = {
            attendee_name: attendeeName,
            attendee_email: attendeeEmail,
            event_id: event.event_id,
        };

        try {
            // Make a POST request to the API to register the attendee
            const response = await fetch('http://localhost:3000/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newAttendee),
            });

            if (response.ok) {
                // Successfully registered the attendee
                console.log('Attendee registered successfully');
                // Reset the form inputs
                setAttendeeName('');
                setAttendeeEmail('');
                // Fetch updated attendees data after registration
                fetchAttendees();
            } else {
                // Handle registration error
                console.error('Failed to register attendee');
                alert('Failed to register attendee');
            }
        } catch (error) {
            console.error('Failed to register attendee:', error);
            alert('Failed to register attendee. Please try again.');
        }
    };

    // Function to fetch attendees data from the server
    const fetchAttendees = async () => {
        try {
            const response = await fetch(`http://localhost:3000/api/attendees/${event.event_id}`);
            const data = await response.json();
            setAttendees(data);
        } catch (error) {
            console.error('Failed to fetch attendees:', error);
            alert('Failed to fetch attendees. Please try again.');
        }
    };

    // Fetch attendees data when the component mounts
    useEffect(() => {
        fetchAttendees();
    }, [event.event_id]); // Refetch attendees data when the event ID changes

    // Function to handle the unregistration process
    const handleUnregister = async (attendeeId) => {
        try {
            // Send a DELETE request to the backend to remove the attendee
            const response = await fetch(`http://localhost:3000/api/attendees/${attendeeId}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                // Successfully deleted the attendee
                console.log(`Attendee with ID ${attendeeId} unregistered successfully`);
                // Remove the attendee from the state
                setAttendees(attendees.filter(attendee => attendee.attendee_id !== attendeeId));
                alert(`Attendee with ID ${attendeeId} unregistered successfully`);
            } else {
                // Handle delete error
                console.error(`Failed to unregister attendee with ID ${attendeeId}`);
                alert(`Failed to unregister attendee with ID ${attendeeId}`);
            }
        } catch (error) {
            console.error(`Failed to unregister attendee with ID ${attendeeId}:`, error);
            alert(`Failed to unregister attendee with ID ${attendeeId}. Please try again.`);
        }
    };

    return (
        <div className="event-details">
            <h2>Event Details</h2>
            <p><strong>Event Name:</strong> {event.event_name}</p>
            <p><strong>Description:</strong> {event.event_description}</p>
            <p><strong>Date:</strong> {event.event_date}</p>
            <p><strong>Location:</strong> {event.event_location}</p>
            <p><strong>Total Seats:</strong> {event.total_seats}</p>
            <p><strong>Remaining Seats:</strong> {event.remaining_seats}</p>

            <h3>Register as an Attendee</h3>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>
                        Name:
                        <input
                            type="text"
                            value={attendeeName}
                            onChange={(e) => setAttendeeName(e.target.value)}
                            required
                        />
                    </label>
                </div>
                <div>
                    <label>
                        Email:
                        <input
                            type="email"
                            value={attendeeEmail}
                            onChange={(e) => setAttendeeEmail(e.target.value)}
                            required
                        />
                    </label>
                </div>
                <button type="submit">Register</button>
            </form>

            <div className="attendee-list">
                {/* Map through attendees and render attendee details */}
                {attendees.map(attendee => (
                    <div key={attendee.attendee_id} className="attendee-details">
                        <p>Attendee ID: {attendee.attendee_id}</p>
                        <p>Name: {attendee.attendee_name}</p>
                        <p>Email: {attendee.attendee_email}</p>
                        <button onClick={() => handleUnregister(attendee.attendee_id)}>Unregister</button>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default EventDetails;
