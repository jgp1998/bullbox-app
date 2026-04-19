export type UserRole = 'athlete' | 'coach' | 'administrative' | 'administrator';

export interface Permissions {
    canManageUsers: boolean;
    canViewFinancials: boolean;
    canViewPerformance: boolean;
    canEditSchedule: boolean;
}

export const ROLE_PERMISSIONS: Record<UserRole, Permissions> = {
    athlete: {
        canManageUsers: false,
        canViewFinancials: false,
        canViewPerformance: true, // Own performance only
        canEditSchedule: false
    },
    coach: {
        canManageUsers: false,
        canViewFinancials: false,
        canViewPerformance: true,
        canEditSchedule: true
    },
    administrative: {
        canManageUsers: true,
        canViewFinancials: true,
        canViewPerformance: false,
        canEditSchedule: true
    },
    administrator: {
        canManageUsers: true,
        canViewFinancials: true,
        canViewPerformance: true,
        canEditSchedule: true
    }
};
