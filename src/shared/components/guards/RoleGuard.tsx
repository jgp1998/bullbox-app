import React from 'react';
import { useAuthStore } from '@/features/auth/store/useAuthStore';
import { UserRole } from '@/core/domain/models/Role';

interface RoleGuardProps {
    allowedRoles: UserRole[];
    children: React.ReactNode;
    fallback?: React.ReactNode;
}

/**
 * RoleGuard checks if the current user has one of the allowed roles 
 * for the active box.
 */
export const RoleGuard: React.FC<RoleGuardProps> = ({ 
    allowedRoles, 
    children, 
    fallback = null 
}) => {
    const { memberships, activeBoxId } = useAuthStore();

    if (!activeBoxId) {
        return <>{fallback}</>;
    }

    const currentMembership = memberships.find(m => m.boxId === activeBoxId);
    
    if (!currentMembership || 
        currentMembership.status !== 'active' || 
        !allowedRoles.includes(currentMembership.role)) {
        return <>{fallback}</>;
    }

    return <>{children}</>;
};
