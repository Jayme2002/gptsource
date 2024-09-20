import React from "react";
import { Chat } from "@prisma/client";
import { DropdownMenuItem } from "./ui/dropdown-menu";
import Link from "next/link";

interface RecentConversationsProps {
    chats: Chat[];  // Change this from groupedChats to chats
    onSelect: () => void;
}

const RecentConversations = ({ chats, onSelect }: RecentConversationsProps) => {
    return (
        <div className="max-h-[300px] overflow-y-auto">
            {chats.map((chat) => (
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
