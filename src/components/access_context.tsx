"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { verifyToken } from "@/lib/models/access";

type AccessContext = {
    logged: string | undefined;
    setLogged: React.Dispatch<React.SetStateAction<string | undefined>>;
};

const context = createContext<AccessContext|undefined>(undefined);

export function AccessProvider({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const [ logged, setLogged ] = useState<string|undefined>(undefined);
    useEffect(() => {
        const checkAuth = async () => {
          try {
            const result = await verifyToken();
            setLogged(result as string);
          } catch (error) {
            console.error("Error verifying token: ", error);
            setLogged(undefined);
          }
        };
        checkAuth();
    }, []);

    return (
        <context.Provider value={{ logged, setLogged }}>
            {children}
        </context.Provider>
    );
}

export function accessCtx() {
    const ctx = useContext(context);
    if (!ctx) {
        throw new Error("accessCtx must be used within an AccessProvider");
    }
    return ctx;
}