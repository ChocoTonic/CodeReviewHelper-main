export enum ChatRole {
  SYSTEM = "system",
  USER = "user",
  ASSISTANT = "assistant",
}

export enum ChatMessageType {
  TEXT = "text",
}

export type ChatMessage = {
  role: ChatRole;
  type: ChatMessageType;
  content: string;
};

export type SimpleChatForm = {
  messages: ChatMessage[];
};
