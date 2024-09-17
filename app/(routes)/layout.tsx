import Navbar from "@/components/navbar";
import ScrollDownButton from "@/components/scroll-down-button";
import Sidebar from "@/components/sidbar";
import { Toaster } from "@/components/ui/toaster";
import { getChats } from "@/lib/api-chat";
import { getApiLimitCount } from "@/lib/api-limit";
import { checkSubscription } from "@/lib/subscription";
import React from "react";
import { SidebarProvider } from "@/contexts/sidebar-context";

export const dynamic = 'force-dynamic';


const DashboardLayout = async ({ children }: { children: React.ReactNode }) => {
    return (
        <SidebarProvider>
            <div className="h-full relative">
                {children}
            </div>
        </SidebarProvider>
    );
};


export default DashboardLayout;
