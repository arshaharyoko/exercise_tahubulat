"use client";

import { useEffect, useState } from "react";
import { accessCtx } from "@/components/access_context";

export default function RestrictedRootLayout({
    children,
}: Readonly<{ children: React.ReactNode }>) {
    const { logged } = accessCtx();
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        if(logged) {
            setLoaded(true);
        }
    }, [logged]);

    if(loaded) {
        if(logged!=="admin") {
            window.location.href = "/error?code=403";
        } else {
            return <>{children}</>
        }
    }
}
