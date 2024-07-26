import {Hono} from "hono";
import {validBody} from "../lib/validator";
import {simpleChatSchema} from "../models/chat";
import {ClaudeChatService} from "../service/ClaudeChatService";
import {ChatService} from "../service/ChatService";
import {feedbackReplyFormSchema} from "../models/feedback";
import {streamText} from "hono/streaming";


const apiRoutes = new Hono();

const chatService: ChatService = new ClaudeChatService();

apiRoutes.post("/chat", validBody(simpleChatSchema), async (c) => {
    const data = c.req.valid("json");
    const response = await chatService.getReplySimpleChat(data);
    return c.stdOk(response);
});

apiRoutes.post("/feedback", validBody(feedbackReplyFormSchema), async (c) => {
    const data = c.req.valid("json");
    return streamText(c, async (stream) => {
        await chatService.getReplyForFeedback(data, stream);
    })
});

export default apiRoutes
