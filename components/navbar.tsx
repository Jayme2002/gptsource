"use client";

import React, { useState } from "react";
import { Button } from "./ui/button";
import { PlusIcon, MessageSquare } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Chat } from '@/types/chat';
import { UserButton } from "@clerk/nextjs";
import { Settings } from "lucide-react";
import FreeCounter from "./free-counter";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "./ui/dropdown-menu";
import RecentConversations from "./recent-conversations";

interface navbarProps {
    apiLimitCount: number;
    chats: Chat[];
    isPro: boolean;
}

const Navbar = ({ apiLimitCount, chats, isPro = false }: navbarProps) => {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="fixed top-0 left-0 right-0 z-50 border-b md:border-none md:min-h-[3rem] flex justify-between items-center px-4 py-2 bg-slate-900">
            <div className="flex items-center space-x-4">
                <Link href="/chat/new">
                    <Button variant="outline" size="sm">
                        <PlusIcon className="h-4 w-4 mr-2" />
                        New Chat
                    </Button>
                </Link>
                <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm">
                            <MessageSquare className="h-4 w-4 mr-2" />
                            Chat History
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56">
                        <RecentConversations chats={chats} onSelect={() => setIsOpen(false)} />
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    );
};

export default Navbar;
