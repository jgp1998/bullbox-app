import React from 'react';
import { AdminEvent } from '../types';

interface AdminPanelProps {
    events: AdminEvent[];
}

const AdminPanel: React.FC<AdminPanelProps> = ({ events }) => {
    return (
        <div className="bg-[var(--card)] p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-4 text-[var(--primary)]">Admin Panel</h2>
            <p className="text-[var(--muted-text)]">Admin features would be here.</p>
        </div>
    );
};

export default AdminPanel;