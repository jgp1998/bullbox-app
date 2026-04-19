import { UserRole } from "./Role";

export interface Membership {
    id: string;
    userId: string;
    boxId: string;
    role: UserRole;
    status: 'active' | 'inactive' | 'pending' | 'invited';
    joinedAt: Date;
    createdAt: Date;
    createdBy: string;
    inviteCode?: string;
}
