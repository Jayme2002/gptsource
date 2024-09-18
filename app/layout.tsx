import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import ModalProvider from "@/components/modal-provider";
import { ToasterProvider } from "@/components/toaser-provider";
import TopLoadingBar from "@/components/loading-bar";
import { CrispProvider } from "@/components/crisp-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "UniGPT",
    description: "AI Chatbot",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <ClerkProvider publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}>
            <html lang="en">
                <body className={inter.className}>
                    <TopLoadingBar />
                    <ModalProvider />
                    <ToasterProvider />
                    {children}
                </body>
            </html>
        </ClerkProvider>
    );
}
