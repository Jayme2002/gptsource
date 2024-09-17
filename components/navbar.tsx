"use client";

import React from "react";
import MobileSidebar from "./mobile-sidebar";
import { Button } from "./ui/button";
import { PlusIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Chat } from '@/types/chat';
import Header from "./header";
import { UserButton } from "@clerk/nextjs";
import { Settings } from "lucide-react";

// Remove the local Chat type definition

interface navbarProps {
    apiLimitCount: number;
    chats: Chat[];
    isPro: boolean;
}

const Navbar = ({ apiLimitCount, chats, isPro = false }: navbarProps) => {
    const pathname = usePathname();
    return (
        <div className="fixed top-0 left-80 right-0 z-50 border-b md:border-none md:min-h-[4rem] flex justify-end items-center px-2.5 py-1 bg-slate-900">
            <div className="flex items-center space-x-2">
                <UserButton
                    appearance={{
                        elements: {
                            avatarBox: {
                                height: "36px",
                                width: "36px",
                            },
                        },
                    }}
                    afterSignOutUrl="/"
                />
                <Link href={"/settings"} className="cursor-pointer text-indigo-300">
                    <Settings strokeWidth={1} className="h-[1.4rem] w-[1.4rem]" />
                </Link>
            </div>
        </div>
    );
};

export default Navbar;
