"use client";

import React from "react";
import { Zap, PlusIcon } from "lucide-react";
import RecentConversations from "./recent-conversations";
import FreeCounter from "./free-counter";
import { Card } from "./ui/card";
import { Chat } from "@prisma/client";
import Link from "next/link";
import moment from "moment";
import { Button } from "./ui/button";

interface SidebarProps {
    apiLimitCount: number;
    chats: Chat[];
    isPro: boolean;
}

interface FreeCounterProps {
    apiLimitCount: number;
    isPro: boolean;
    variant?: "default" | "small";
}

const Sidebar: React.FC<SidebarProps> = ({ apiLimitCount, chats, isPro }) => {
    return (
        <div className="flex flex-col h-full w-full md:w-80 bg-slate-800">
            <div className="flex items-center justify-between p-4">
                <div className="flex items-center space-x-2">
                    <Zap className="text-indigo-400" size={24} />
                    <h1 className="text-xl font-semibold text-indigo-300">UniGPT</h1>
                </div>
                <Link href="/chat/new">
                    <Button variant="outline" size="sm" className="px-2 py-1">
                        <PlusIcon className="h-4 w-4" />
                    </Button>
                </Link>
            </div>

            <div className="flex-grow overflow-y-auto mb-auto">
                <RecentConversations chats={chats} onSelect={() => {}} />
            </div>

            <FreeCounter apiLimitCount={apiLimitCount} isPro={isPro} />
        </div>
    );
};

export default Sidebar;