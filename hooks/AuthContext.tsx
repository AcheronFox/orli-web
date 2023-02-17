import { IUser } from '@/models/user.model';
import { createContext } from 'react';

interface AuthContext {
    user: IUser | null;
    setUser: (user: IUser | null) => void;
}

export const AuthContext = createContext<AuthContext>({
    user: null,
    setUser: () => { },
});