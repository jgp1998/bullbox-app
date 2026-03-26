import React from 'react';
import { AdminEvent } from '../../types';
import Card from '../ui/Card';

interface UpcomingEventsProps {
    events: AdminEvent[];
}

const UpcomingEvents: React.FC<UpcomingEventsProps> = ({ events }) => {
    return (
        <Card title="Upcoming Events">
            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                {events.length > 0 ? (
                    events.map(event => (
                        <div key={event.id} className="bg-[var(--input)] p-4 rounded-xl border border-transparent hover:border-[var(--border)] transition-all">
                            <p className="font-bold text-[var(--text)]">{event.name}</p>
                            <p className="text-sm font-semibold text-[var(--primary)] uppercase tracking-tight mt-1">
                                {new Date(event.date).toLocaleDateString(undefined, {
                                    weekday: 'short',
                                    month: 'long',
                                    day: 'numeric',
                                    year: 'numeric'
                                })}
                            </p>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-10 bg-[var(--input)] rounded-xl border border-dashed border-[var(--border)]">
                         <p className="text-[var(--muted-text)] font-medium">No upcoming events.</p>
                    </div>
                )}
            </div>
            
            <style>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: var(--border);
                    border-radius: 10px;
                }
            `}</style>
        </Card>
    );
};

export default UpcomingEvents;
