import {z} from "zod";

export enum ChatRole {
    SYSTEM = "system",
    USER = "user",
    ASSISTANT = "assistant",
}

export enum ChatMessageType {
    TEXT = "text",
}

export const chatMessageSchema = z.object({
    role: z.nativeEnum(ChatRole),
    type: z.nativeEnum(ChatMessageType),
    content: z.string(),
});
export type ChatMessage = z.infer<typeof chatMessageSchema>;

export const simpleChatSchema = z.object({
   messages: z.array(chatMessageSchema).min(1)
});
export type SimpleChatForm = z.infer<typeof simpleChatSchema>;