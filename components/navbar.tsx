"use client";

import React from "react";
import MobileSidebar from "./mobile-sidebar";
import { UserButton } from "@clerk/nextjs";
import { Settings } from "lucide-react";
import Link from "next/link";
import { Chat } from '@/types/chat';

interface navbarProps {
    apiLimitCount: number;
    chats: Chat[];
    isPro: boolean;
}

const Navbar = ({ apiLimitCount, chats, isPro = false }: navbarProps) => {
    return (
        <div className="fixed top-0 w-full z-50 flex items-center justify-between p-4 border-b border-primary/10 bg-secondary">
            <MobileSidebar apiLimitCount={apiLimitCount} chats={chats} isPro={isPro} />
            <div className="flex items-center gap-x-3">
                <UserButton afterSignOutUrl="/" />
                <Link href="/settings" className="cursor-pointer text-muted-foreground hover:text-primary">
                    <Settings />
                </Link>
            </div>
        </div>
    );
};

export default Navbar;
