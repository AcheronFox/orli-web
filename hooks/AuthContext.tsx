import { IUser } from '@/models/user.model';
import { createContext } from 'react';

interface AuthContext {
    user: IUser | null;
    didUserInit: boolean;
    setUser: (user: IUser | null) => void;
    setDidUserInit: (val: boolean) => void;
}

export const AuthContext = createContext<AuthContext>({
    user: null,
    didUserInit: false,
    setUser: () => { },
    setDidUserInit: () => { },
});