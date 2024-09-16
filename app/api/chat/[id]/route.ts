import {prisma} from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import OpenAI from "openai";
import { PrismaClient } from '@prisma/client';

export async function GET(request: Request, { params }: { params: { id: string } }) {
    try {
        const id = params.id;
        const { userId } = auth()

        if (typeof id !== "string") {
            return new NextResponse("Invalid ID", { status: 400 });
        }

        if (!userId) {
            return new NextResponse("Invalid User ID", { status: 400 });
        }

        const chat = await prisma.chat.findUnique({
            where: {
                id,
                userId,
            },
        });

        let messages: OpenAI.Chat.Completions.ChatCompletionMessage[] = [];

        if (!chat) {
            return new NextResponse("Chat not found", { status: 404 });
        } else {
            const oldMessages = await prisma.message.findMany({
                where: {
                    chatId: id,
                },
                orderBy: {
                    createdAt: "asc",
                },
            });
            messages = messages.concat(
                oldMessages.map((msg: { role: string; content: string }) => ({
                    role: msg.role as OpenAI.Chat.Completions.ChatCompletionRole,
                    content: msg.content,
                }))
            );
        }

        return NextResponse.json(messages, { status: 200 });
    } catch (error) {
        console.error(error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const { userId } = auth();

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const chat = await prisma.chat.findUnique({
            where: {
                id: params.id,
                userId: userId,
            },
        });

        if (!chat) {
            return new NextResponse("Not Found", { status: 404 });
        }

        // Use a transaction to ensure data consistency
        await prisma.$transaction(async (tx: PrismaClient) => {
            // Delete associated messages first
            await tx.message.deleteMany({
                where: {
                    chatId: params.id,
                },
            });

            // Then delete the chat
            await tx.chat.delete({
                where: {
                    id: params.id,
                },
            });
        });

        return new NextResponse("Chat deleted successfully", { status: 200 });
    } catch (error) {
        console.error("[CHAT_DELETE]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
