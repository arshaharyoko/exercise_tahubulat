"use client";

import { useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";

const ErrorPage = dynamic(() => Promise.resolve(ErrorComponent), { ssr: false });

function ErrorComponent() {
    const errorCode = useSearchParams().get("code");
    return (
        <div className="flex w-full h-screen justify-center items-center">
            <h1 className="text-8xl">{errorCode}</h1>
        </div>
    )
}

export default ErrorPage;