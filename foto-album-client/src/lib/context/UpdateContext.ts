import { createContext } from "react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const UpdateContext = createContext< { update: boolean, setUpdate: any}>(
    { update: false, setUpdate: () => {}}
    )