import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Margarine, Quantico } from "next/font/google";
import "./globals.css";

import { AccessProvider } from "@/components/access_context";
import AccountDropdown from "@/components/account_dropdown";

const margarineSans = Margarine({
    variable: "--font-margarine-sans",
    weight: ["400"],
    subsets: ["latin"],
});

const quanticoSans = Quantico({
    variable: "--font-quantico-sans",
    weight: ["400"],
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Tahoe Boelat",
    description: "One stop shop for Tahoe Boelat.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <AccessProvider>
        <html lang="en" className={`${margarineSans.variable} ${quanticoSans.variable} antialiased`}>
            <body className="bg-orange-200 font-[family-name:var(--font-margarine-sans)] px-2 py-4 sm:px-4 sm:py-2 md:px-8 md:py-0 text-white font-outline-1 overflow-hidden">
                <nav className="flex items-center underline decoration-black decoration-2"> 
                    <div className="w-[calc(12vw)] sm:w-[calc(16vw)] md:w-[calc(25vw)]">
                        <Image
                            src="/tahoeboelat.avif"
                            alt="Logo Tahoe Boelat"
                            width={128}
                            height={128}
                        />
                    </div>
                    <div className="grid grid-flow-col justify-items-center gap-0 text-xl sm:text-2xl md:text-3xl w-full">
                        <Link href="/">Home</Link>
                        <Link href="/catalog">Catalog</Link>
                    </div>
                    <div className="relative w-[calc(12vw)] sm:w-[calc(16vw)] md:w-[calc(25vw)]">
                        <AccountDropdown className="float-right"/>
                    </div>
                </nav>
            {children}
            </body>
        </html>
        </AccessProvider>
    );
}
