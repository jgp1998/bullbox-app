import React from 'react';
import { AdminEvent } from '../types';

interface UpcomingEventsProps {
    events: AdminEvent[];
}

const UpcomingEvents: React.FC<UpcomingEventsProps> = ({ events }) => {
    return (
        <div className="bg-[var(--card)] p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-4 text-[var(--primary)]">Upcoming Events</h2>
            <div className="space-y-3">
                {events.length > 0 ? (
                    events.map(event => (
                        <div key={event.id} className="bg-[var(--background)] p-3 rounded-md">
                            <p className="font-semibold text-[var(--text)]">{event.name}</p>
                            <p className="text-sm text-[var(--muted-text)]">{new Date(event.date).toLocaleDateString()}</p>
                        </div>
                    ))
                ) : (
                    <p className="text-center text-[var(--muted-text)]">No upcoming events.</p>
                )}
            </div>
        </div>
    );
};

export default UpcomingEvents;
