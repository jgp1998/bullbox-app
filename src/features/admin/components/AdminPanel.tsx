import React from 'react';
import { AdminEvent } from '@/types';
import Card from '@/src/shared/components/ui/Card';

interface AdminPanelProps {
    events: AdminEvent[];
}

const AdminPanel: React.FC<AdminPanelProps> = ({ events }) => {
    return (
        <Card title="Admin Panel">
            <div className="p-8 text-center bg-[var(--input)] rounded-xl border border-dashed border-[var(--border)]">
                <p className="text-[var(--muted-text)] font-medium italic">
                    Admin features would be here. Data management and system settings coming soon.
                </p>
            </div>
        </Card>
    );
};

export default AdminPanel;

