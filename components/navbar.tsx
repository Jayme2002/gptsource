"use client";

import React from "react";
import { UserButton } from "@clerk/nextjs";
import { Menu, Settings } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";
import { useSidebar } from "@/contexts/sidebar-context";

const Navbar = () => {
    const { toggleSidebar } = useSidebar();

    return (
        <div className="fixed top-0 w-full z-50 flex items-center justify-between p-4 border-b border-primary/10 bg-secondary">
            <Button variant="ghost" size="icon" onClick={toggleSidebar} className="md:hidden">
                <Menu />
            </Button>
            <div className="flex items-center gap-x-3">
                <UserButton afterSignOutUrl="/" />
                <Link href="/settings" className="cursor-pointer text-muted-foreground hover:text-primary">
                    <Settings />
                </Link>
            </div>
        </div>
    );
};

export default Navbar;
