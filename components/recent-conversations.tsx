import React from "react";
import { Chat as ChatType } from "@prisma/client";
import { DropdownMenuItem } from "./ui/dropdown-menu";
import Link from "next/link";

interface RecentConversationsProps {
    groupedChats: ChatType[];
    onSelect: () => void;
}

const RecentConversations = ({ groupedChats, onSelect }: RecentConversationsProps) => {
    return (
        <div className="max-h-[300px] overflow-y-auto">
            {groupedChats.map((chat) => (
                <DropdownMenuItem key={chat.id} onSelect={onSelect}>
                    <Link href={`/chat/${chat.id}`} className="w-full">
                        {chat.title || "Untitled Chat"}
                    </Link>
                </DropdownMenuItem>
            ))}
        </div>
    );
};

export default RecentConversations;
