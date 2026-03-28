export interface User {
    username: string;
    gender: 'Male' | 'Female' | 'Other';
    email: string;
    dob: string;
    password?: string; 
}

export interface AuthState {
    user: User | null;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
    register: (newUser: User & { password: string }) => Promise<void>;
    resetPassword: (email: string) => Promise<void>;
    setUser: (user: User | null) => void;
}
