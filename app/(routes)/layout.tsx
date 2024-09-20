import Navbar from "@/components/navbar";
import ScrollDownButton from "@/components/scroll-down-button";
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
        <div className="h-full relative flex flex-col">
            <Navbar isPro={isPro} apiLimitCount={apiLimitCount} chats={chats} />
            <div className="flex-1 overflow-auto">
                <ScrollDownButton />
                {children}
            </div>
            <Toaster />
        </div>
    );
};

export default DashboardLayout;
