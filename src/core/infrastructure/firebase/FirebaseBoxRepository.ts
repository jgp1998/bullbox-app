import { doc, getDoc, setDoc, updateDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/shared/services/firebase';
import { Box } from '../../domain/models/Box';
import { BoxRepository } from '../../domain/repositories/BoxRepository';

export class FirebaseBoxRepository implements BoxRepository {
    async getBoxById(id: string): Promise<Box | null> {
        const docRef = doc(db, 'boxes', id);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
            return { id: docSnap.id, ...docSnap.data() } as Box;
        }
        return null;
    }

    async getBoxBySlug(slug: string): Promise<Box | null> {
        const q = query(collection(db, 'boxes'), where('slug', '==', slug));
        const querySnapshot = await getDocs(q);
        
        if (!querySnapshot.empty) {
            const doc = querySnapshot.docs[0];
            return { id: doc.id, ...doc.data() } as Box;
        }
        return null;
    }

    async createBox(box: Omit<Box, 'id' | 'createdAt'>): Promise<string> {
        const docRef = doc(collection(db, 'boxes'));
        const newBox = {
            ...box,
            createdAt: new Date()
        };
        await setDoc(docRef, newBox);
        return docRef.id;
    }

    async updateBox(id: string, box: Partial<Box>): Promise<void> {
        const docRef = doc(db, 'boxes', id);
        await updateDoc(docRef, box as any);
    }
}
