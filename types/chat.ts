export type Chat = {
    id: string;
    userId: string;
    title: string;
    isFavourite: boolean;
    isCode: boolean;
    createdAt: Date;
    messageUpdatedAt: Date;
    updatedAt: Date;
    Message: any[]; // Remove the optional marker
    Plugin: any[]; // Remove the optional marker
};

export type ChatSummary = Omit<Chat, 'Message' | 'Plugin'>;