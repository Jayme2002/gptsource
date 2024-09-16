import React from "react";
import { getMessages } from "@/lib/api-chat";
import ChatPage from "@/components/chat-page";
import { ObjectId } from "mongodb";

const Page = async ({ params: { chatId } }: { params: { chatId: string } }) => {
    // Add this validation
    if (!ObjectId.isValid(chatId)) {
        return <div>Invalid Chat ID</div>;
    }

    const initialMessages = await getMessages(chatId) || [];

    return <ChatPage initialMessages={initialMessages} chatId={chatId} />;
};

export default Page;
