import React from "react";
import ChatPage from "@/components/chat-page";

const Page = async () => {
    return (
        <div className="h-full flex flex-col">
            <div className="flex-grow">
                <ChatPage />
            </div>
        </div>
    );
};

export default Page;