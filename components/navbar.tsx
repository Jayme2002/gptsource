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
import FreeCounter from "./free-counter";

// Remove the local Chat type definition

interface navbarProps {
    apiLimitCount: number;
    chats: Chat[];
    isPro: boolean;
}

const Navbar = ({ apiLimitCount, chats, isPro = false }: navbarProps) => {
    const pathname = usePathname();
    return (
        <div className="fixed top-0 left-0 md:left-80 right-0 z-50 border-b md:border-none md:min-h-[3rem] flex justify-between items-center px-2 py-0.5 bg-slate-900">
            <div className="md:hidden flex items-center justify-between w-full">
                <div className="flex items-center space-x-2">
                    <MobileSidebar apiLimitCount={apiLimitCount} chats={chats} isPro={isPro} />
                    <FreeCounter apiLimitCount={apiLimitCount} isPro={isPro} variant="small" />
                </div>
                <div className="flex items-center space-x-1">
                    <UserButton
                        appearance={{
                            elements: {
                                avatarBox: {
                                    height: "32px",
                                    width: "32px",
                                },
                            },
                        }}
                        afterSignOutUrl="/"
                    />
                    <Link href={"/settings"} className="cursor-pointer text-indigo-300">
                        <Settings strokeWidth={1} className="h-[1.2rem] w-[1.2rem]" />
                    </Link>
                </div>
            </div>
            <div className="hidden md:flex flex-1 justify-end items-center space-x-2">
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
