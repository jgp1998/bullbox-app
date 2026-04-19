import { 
    collection, 
    query, 
    where, 
    getDocs, 
    addDoc, 
    updateDoc, 
    doc,
    setDoc
} from 'firebase/firestore';
import { db } from '@/shared/services/firebase';
import { Membership } from '../../domain/models/Membership';
import { MembershipRepository } from '../../domain/repositories/MembershipRepository';

export class FirebaseMembershipRepository implements MembershipRepository {
    private colRef = collection(db, 'memberships');

    async getUserMemberships(userId: string): Promise<Membership[]> {
        const q = query(this.colRef, where('userId', '==', userId));
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Membership));
    }

    async getBoxMemberships(boxId: string): Promise<Membership[]> {
        const q = query(this.colRef, where('boxId', '==', boxId));
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Membership));
    }

    async getMembership(userId: string, boxId: string): Promise<Membership | null> {
        const q = query(
            this.colRef, 
            where('userId', '==', userId), 
            where('boxId', '==', boxId)
        );
        const querySnapshot = await getDocs(q);
        
        if (!querySnapshot.empty) {
            const doc = querySnapshot.docs[0];
            return { id: doc.id, ...doc.data() } as Membership;
        }
        return null;
    }

    async joinBox(userId: string, boxId: string, role: Membership['role']): Promise<void> {
        const membershipData: Omit<Membership, 'id'> = {
            userId,
            boxId,
            role,
            status: 'active',
            joinedAt: new Date(),
            createdAt: new Date(),
            createdBy: userId // In a join, the user creates their own unless joined by admin
        };
        await addDoc(this.colRef, membershipData);
    }

    async updateRole(membershipId: string, role: Membership['role']): Promise<void> {
        const docRef = doc(this.colRef, membershipId);
        await updateDoc(docRef, { role });
    }
}
