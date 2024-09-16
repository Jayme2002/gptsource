import React from "react";
import { createNewChat } from "@/lib/api-chat";
import { redirect } from "next/navigation";

const Page = async () => {
    const newChat = await createNewChat();

    if (!newChat) {
        return redirect("/chat");
    }

    return redirect(`/chat/${newChat.id}`);
};

export default Page;
