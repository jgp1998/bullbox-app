import { UserRole } from "./Role";

export interface Invite {
    id: string;
    boxId: string;
    email: string;
    role: UserRole;
    status: 'pending' | 'accepted' | 'expired';
    createdAt: Date;
    expiresAt: Date;
    invitedBy: string; // userId of the admin
    inviteeUserId?: string; // Optional direct target userId
}
