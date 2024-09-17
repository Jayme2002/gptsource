import Navbar from "@/components/navbar";
import ScrollDownButton from "@/components/scroll-down-button";
import Sidebar from "@/components/sidbar";
import { Toaster } from "@/components/ui/toaster";
import { getChats } from "@/lib/api-chat";
import { getApiLimitCount } from "@/lib/api-limit";
import { checkSubscription } from "@/lib/subscription";
import React from "react";

export const dynamic = 'force-dynamic';

const DashboardLayout = async ({ children }: { children: React.ReactNode }) => {
    const apiLimitCount = await getApiLimitCount();
    const chats = await getChats();
    const isPro = await checkSubscription();

    return (
        <div className="h-full relative flex">
            <section className="h-full fixed w-80 hidden md:block">
                <Sidebar isPro={isPro} apiLimitCount={apiLimitCount} chats={chats} />
            </section>
            <section className="flex-1 md:ml-80 bg-slate-900 h-full flex flex-col">
                <Navbar isPro={isPro} apiLimitCount={apiLimitCount} chats={chats} />
                <div className="mt-16 flex-grow overflow-auto">
                    <ScrollDownButton />
                    {children}
                </div>
            </section>
            <Toaster />
        </div>
    );
};

export default DashboardLayout;
