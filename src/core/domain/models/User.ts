export interface User {
    uid: string;
    username: string;
    email: string;
    gender: 'Male' | 'Female' | 'Other';
    dob: string;
    photoURL?: string;
    activeBoxId?: string;
}
