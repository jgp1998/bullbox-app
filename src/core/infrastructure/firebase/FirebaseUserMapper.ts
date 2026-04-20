import { User as FirebaseUser } from 'firebase/auth';
import { User } from '../../domain/models/User';

export class FirebaseUserMapper {
  static toDomain(firebaseUser: FirebaseUser, userData?: any): User {
    return {
      uid: firebaseUser.uid,
      email: firebaseUser.email || '',
      username: userData?.username || firebaseUser.displayName || '',
      gender: userData?.gender || 'Other',
      dob: userData?.dob || '',
      photoURL: firebaseUser.photoURL || undefined,
      role: userData?.role
    };
  }
}
