import { IUser } from '@/models/user.model';
import { createContext } from 'react';

interface UserContext {
    user: IUser | null;
    didUserInit: boolean;
    setUser: (user: IUser | null) => void;
    setDidUserInit: (val: boolean) => void;
}

export const UserContext = createContext<UserContext>({
    user: null,
    didUserInit: false,
    setUser: () => { },
    setDidUserInit: () => { },
});