import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";
import { Configuration, OpenAIApi } from "openai-edge";
import { checkUserApiLlimit, increateApiLimit } from "@/lib/api-limit";
import { checkSubscription } from "@/lib/subscription";
import { ChatCompletionRequestMessage } from "openai-edge";

export const runtime = "edge";

const config = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(config);

export async function POST(req: Request) {
    try {
        const { userId } = auth();
        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const formData = await req.formData();
        const file = formData.get('file') as File;
        const message = formData.get('message') as string;

        if (!file || !message) {
            return new NextResponse("File and message are required", { status: 400 });
        }

        const [freeTrial, isPro] = await Promise.all([checkUserApiLlimit(), checkSubscription()]);

        if (!freeTrial && !isPro) {
            return new NextResponse("Free Trial Exhausted", { status: 403 });
        }

        // Convert file to base64
        const buffer = await file.arrayBuffer();
        const base64Image = Buffer.from(buffer).toString('base64');

        // Prepare the message content
        const content = [
            { type: "text", text: message },
            { type: "image_url", image_url: { url: `data:image/jpeg;base64,${base64Image}` } }
        ];

        // Send to OpenAI API
        const response = await openai.createChatCompletion({
            model: "gpt-4-vision-preview",
            messages: [
                {
                    role: "user",
                    content: JSON.stringify(content), // Convert content to string
                } as ChatCompletionRequestMessage,
            ],
        });

        const completion = await response.json();

        await increateApiLimit();

        return NextResponse.json(completion, { status: 200 });
    } catch (error) {
        console.error("[CHAT_WITH_IMAGE_ERROR]", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}