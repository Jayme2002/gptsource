"use client";

import { cn } from "@/lib/utils";
import type { Chat } from "@prisma/client";
import { MessageSquare, MoreHorizontal, Trash } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

const Chat = ({ chat }: { chat: Chat }) => {
    const pathname = usePathname();
    const router = useRouter();

    const [isOpen, setIsOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleMenu = (e: React.MouseEvent<SVGSVGElement>) => {
        e.stopPropagation();
        setIsOpen((current) => !current);
    };

    const handleDelete = async (e: React.MouseEvent<SVGSVGElement>) => {
        e.stopPropagation();
        e.preventDefault();

        try {
            setIsDeleting(true);
            await axios.delete(`/api/chat/${chat.id}`);
            router.refresh();
            if (pathname.includes(chat.id)) {
                router.push("/chat");
            }
        } catch (error) {
            console.error("Error deleting chat:", error);
            toast.error("Failed to delete chat");
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div
            className={cn(
                "flex space-x-2 items-center rounded-sm hover:bg-slate-925",
                {
                    "bg-slate-900 hover:bg-slate-900": pathname.includes(chat.id),
                }
            )}>
            <Link href={`/chat/${chat.id}`} className="flex p-2.5 w-full space-x-2 items-center  cursor-pointer">
                <MessageSquare className="text-indigo-300/80" size={16} />
                <p className="text-sm text-slate-300 truncate w-1 flex-grow">{chat.title}</p>
            </Link>
            <div
                onClick={(e) => e.preventDefault()}
                onMouseEnter={() => setIsOpen(true)}
                onMouseLeave={() => setIsOpen(false)}
                className="flex pe-2.5 space-x-2 items-center  cursor-pointer">
                {isOpen && (
                    <Trash
                        onClick={handleDelete}
                        className={cn(
                            "text-indigo-300/70 hover:text-indigo-300/90",
                            { "opacity-50 cursor-not-allowed": isDeleting }
                        )}
                        size={15}
                    />
                )}
                <MoreHorizontal className="text-indigo-300/70 hover:text-indigo-300/90" size={16} />
            </div>
        </div>
    );
};

export default Chat;
