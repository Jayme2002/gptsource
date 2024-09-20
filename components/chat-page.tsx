"use client";

import React, { useEffect, useRef } from "react";
import { useChat, Message as AIMessage } from "ai/react";
import Message from "@/components/message";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";

interface ChatPageProps {
  initialMessages?: AIMessage[];
  chatId?: string | null;
}

const ChatPage: React.FC<ChatPageProps> = ({ initialMessages = [], chatId = null }) => {
    const router = useRouter();
    const { messages, input, handleInputChange, handleSubmit } = useChat({
        initialMessages,
        api: "/api/chat",
        body: { chatId },
        onFinish: (message) => {
            if (!chatId) {
                // If it's a new chat, redirect to the chat page with the new chatIds
                router.push(`/chat/${message.id}`);
            }
        },
    });

    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    return (
        <div className="flex flex-col h-full max-w-4xl mx-auto pt-16">
            <div className="flex-grow overflow-auto p-4">
                {messages.map((message) => (
                    <Message key={message.id} id={message.id} message={message} />
                ))}
                <div ref={messagesEndRef} />
            </div>
            <form onSubmit={handleSubmit} className="p-4 flex">
                <Input
                    value={input}
                    onChange={handleInputChange}
                    placeholder="Type your message..."
                    className="flex-grow mr-2"
                />
                <Button type="submit">Send</Button>
            </form>
        </div>
    );
};

export default ChatPage;
