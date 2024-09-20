"use client";

import { cn } from "@/lib/utils";
import type { Chat } from "@prisma/client";
import { MessageSquare, MoreHorizontal, Trash, PaperclipIcon } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useState, useRef } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { PaperClipIcon } from '@heroicons/react/24/outline';

const Chat = ({ chat }: { chat: Chat }) => {
    const pathname = usePathname();
    const router = useRouter();

    const [isOpen, setIsOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

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

    const handleImageUpload = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedImage(file);
        }
    };

    const convertImageToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                if (typeof reader.result === 'string') {
                    resolve(reader.result.split(',')[1]);
                } else {
                    reject(new Error('Failed to convert image to base64'));
                }
            };
            reader.onerror = (error) => reject(error);
        });
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
                <PaperclipIcon className="text-indigo-300/70 hover:text-indigo-300/90" size={16} onClick={handleImageUpload} />
            </div>
        </div>
    );
};

export default Chat;
