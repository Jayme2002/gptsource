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

const Sidebar = ({ apiLimitCount = 0, chats, isPro = false }: SidebarProps) => {
    const groupedChats: { [key: string]: Chat[] } = {};

    chats.forEach((chat) => {
        const date = moment(chat.messageUpdatedAt).format("YYYY-MM-DD");

        if (date === moment().format("YYYY-MM-DD")) {
            groupedChats["Today"] = groupedChats["Today"] || [];
            groupedChats["Today"].push(chat);
        } else if (date === moment().subtract(1, "days").format("YYYY-MM-DD")) {
            groupedChats["Yesterday"] = groupedChats["Yesterday"] || [];
            groupedChats["Yesterday"].push(chat);
        } else if (moment(date).isAfter(moment().subtract(7, "days"))) {
            groupedChats["Previous 7 days"] = groupedChats["Previous 7 days"] || [];
            groupedChats["Previous 7 days"].push(chat);
        } else if (moment(date).isAfter(moment().subtract(30, "days"))) {
            groupedChats["Previous 30 days"] = groupedChats["Previous 30 days"] || [];
            groupedChats["Previous 30 days"].push(chat);
        } else {
            const monthYear = moment(chat.messageUpdatedAt).format("MMMM YYYY");
            groupedChats[monthYear] = groupedChats[monthYear] || [];
            groupedChats[monthYear].push(chat);
        }
    });

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
                <RecentConversations groupedChats={groupedChats} />
            </div>
        </div>
    );
};

export default Sidebar;