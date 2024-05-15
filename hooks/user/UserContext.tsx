import { IAttendeeFullData } from '@/models/newDbModels/attendeeFullData.model';
import { createContext } from 'react';

interface UserContext {
    user: IAttendeeFullData | null;
    didUserInit: boolean;
    setUser: (user: IAttendeeFullData | null) => void;
    setDidUserInit: (val: boolean) => void;
}

export const UserContext = createContext<UserContext>({
    user: null,
    didUserInit: false,
    setUser: () => { },
    setDidUserInit: () => { },
});