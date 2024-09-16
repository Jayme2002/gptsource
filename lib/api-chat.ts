import { prisma } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import OpenAI from "openai";
import { PrismaClient, Prisma } from "@prisma/client";
import { Chat, ChatSummary } from '@/types/chat';
import { ObjectId } from "mongodb";

type messages = {
    id: string;
    role: "function" | "system" | "user" | "assistant";
    content: string;
}[];

export const getMessages = async (id: string) => {
    const { userId } = auth();

    if (!userId || !id) {
        console.error("getMessages: Missing userId or chatId", { userId, id });
        return null;
    }

    // Add this validation
    if (!ObjectId.isValid(id)) {
        console.error("getMessages: Invalid chatId", { id });
        return null;
    }

    try {
        const chat = await prisma.chat.findUnique({
            where: {
                id,
                userId,
            },
            include: {
                Message: {
                    orderBy: {
                        createdAt: "asc",
                    },
                },
            },
        });

        if (!chat) {
            console.error("getMessages: Chat not found", { id, userId });
            return null;
        }

        const messages = chat.Message.map((msg: { id: string; role: string; content: string }) => ({
            id: msg.id,
            role: msg.role as "function" | "system" | "user" | "assistant",
            content: msg.content,
        }));

        return messages;
    } catch (error) {
        console.error("getMessages: Error fetching messages", error);
        return null;
    }
};

export const getChats = async (): Promise<Chat[]> => {
    const { userId } = auth();

    if (!userId) return [];

    const chats = await prisma.chat.findMany({
        where: {
            userId,
            Message: {
                some: {} // This ensures at least one message exists
            },
        },
        include: {
            Message: true,
            Plugin: true,
        },
        orderBy: {
            messageUpdatedAt: "desc",
        },
    });

    return chats;
};

export const createNewChat = async () => {
    const { userId } = auth();

    if (!userId) return null;

    const oldEmptyChat = await prisma.chat.findFirst({
        where: {
            userId,
            title: "",
            Message: {
                none: {}
            },
        },
    });

    if (oldEmptyChat) {
        return await prisma.chat.update({
            where: {
                id: oldEmptyChat.id,
            },
            data: {
                createdAt: new Date(),
            },
        });
    }

    const chat = await prisma.chat.create({
        data: {
            userId,
            title: "",
        },
    });

    return chat;
};

export const getLastChat = async () => {
    const { userId } = auth();

    if (!userId) return { id: '' };

    const lastChat = await prisma.chat.findFirst({
        where: {
            userId,
            Message: {
                some: {} // This ensures at least one message exists
            },
        },
        orderBy: {
            messageUpdatedAt: 'desc',
        },
    });

    return lastChat || { id: '' };
};
