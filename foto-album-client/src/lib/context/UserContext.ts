import { createContext } from "react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const UserContext = createContext< { isLogged: boolean, setIsLogged: any, user_id: string}>(
    { isLogged: false, setIsLogged: () => {}, user_id: ""})