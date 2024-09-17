import Navbar from "@/components/navbar";
import Sidebar from "@/components/sidbar";
import { getChats } from "@/lib/api-chat";
import { getApiLimitCount } from "@/lib/api-limit";
import { checkSubscription } from "@/lib/subscription";
import React from "react";

export const dynamic = 'force-dynamic';

const ChatLayout = async ({ children }: { children: React.ReactNode }) => {
    const apiLimitCount = await getApiLimitCount();
    const chats = await getChats();
    const isPro = await checkSubscription();

    return (
        <div className="h-full relative">
            <Navbar />
            <Sidebar isPro={isPro} apiLimitCount={apiLimitCount} chats={chats} />
            <main className="pt-16 md:pl-64 h-full transition-all duration-300 ease-in-out">
                {children}
            </main>
        </div>
    );
};

export default ChatLayout;
