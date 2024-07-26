import {ChatService} from "./ChatService";
import {Singleton} from "../lib/decorators";
import {ChatMessage, ChatMessageType, ChatRole, SimpleChatForm} from "../models/chat";
import claudeClient from "../lib/anthropic";
import logger from "../lib/logger";
import Anthropic from "@anthropic-ai/sdk";
import MessageParam = Anthropic.MessageParam;
import {FeedbackReplyForm} from "../models/feedback";
import {StreamingApi} from "hono/utils/stream";
import * as fs from "node:fs";
import * as path from "node:path";

@Singleton
export class ClaudeChatService implements ChatService {


    private chatMessageToClaudeMessage(message: ChatMessage): MessageParam {
        if (message.role === "system") {
            logger.warn("Unexpected role", message)
            return {
                role: "user",
                content: message.content,
            }
        }
        return {
            role: message.role,
            content: message.content,
        }
    }

    private claudeResponseToChatMessage(block: Anthropic.Messages.ContentBlock): Omit<ChatMessage, 'role'> | null {
        if (block.type === "text") {
            return {
                type: ChatMessageType.TEXT,
                content: block.text,
            }
        }
        logger.warn("Unexpected content type", block)
        return null
    }

    async getReplySimpleChat(form: SimpleChatForm): Promise<ChatMessage[]> {
        const response = await claudeClient.messages.create({
            model: "claude-3-5-sonnet-20240620",
            max_tokens: 256,
            messages: form.messages.map(this.chatMessageToClaudeMessage),
        })
        return response.content.map(this.claudeResponseToChatMessage)
            .filter((message) => message !== null)
            .map((message) => {
                return {
                    role: ChatRole.ASSISTANT,
                    ...message,
                }
            });
    }

    async createPrompt(form: FeedbackReplyForm): Promise<string> {
        const templateFile = path.join(__dirname, "..", "..", "prompt.txt");
        const templateContent = fs.readFileSync(templateFile, 'utf8');
        return templateContent
          .replace("{{feedback}}", form.feedback)
          .replace("{{context}}", form.context)
          .replace("{{chat}}", form.chat)
          .replace("{{snippet}}", form.snippet)
          .replace("{{source}}", form.source.content)
          .replace("{{sourceType}}", form.source.type);
    }

    async getReplyForFeedback(form: FeedbackReplyForm, stream: StreamingApi) {
        const response = claudeClient.messages.stream({
            model: "claude-3-5-sonnet-20240620",
            max_tokens: 1024,
            messages: [
                {
                    role: "user",
                    content: await this.createPrompt(form),
                }
            ],
        })
        response.on("text", (text) => {
            stream.write(text)
        });
        response.on("end", () => {
            stream.close()
        });

        while (!stream.closed) {
            await stream.sleep(100)
        }
    }

}
