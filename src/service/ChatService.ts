import {ChatMessage, SimpleChatForm} from "../models/chat";
import {FeedbackReplyForm} from "../models/feedback";
import {StreamingApi} from "hono/utils/stream";

export interface ChatService {
    getReplySimpleChat(form: SimpleChatForm): Promise<ChatMessage[]>;
    getReplyForFeedback(form: FeedbackReplyForm, stream: StreamingApi): Promise<void>;
}
