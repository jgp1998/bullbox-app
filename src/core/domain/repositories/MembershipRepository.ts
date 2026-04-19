import { Membership } from "../models/Membership";

export interface MembershipRepository {
    getUserMemberships(userId: string): Promise<Membership[]>;
    getBoxMemberships(boxId: string): Promise<Membership[]>;
    getMembership(userId: string, boxId: string): Promise<Membership | null>;
    joinBox(userId: string, boxId: string, role: Membership['role']): Promise<void>;
    updateRole(membershipId: string, role: Membership['role']): Promise<void>;
}
