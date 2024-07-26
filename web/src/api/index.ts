import {apiClient} from "./client"
import {ChatMessage, SimpleChatForm} from "@/model/chat.ts";
import {FeedbackReplyForm} from "@/model/feedback.ts";

export type StandardResponse<T> = {
  success: boolean;
  data?: T;
  error?: string;
};

const api = {
  chat: {
    create: (data: SimpleChatForm) => {
      return apiClient.post<StandardResponse<ChatMessage[]>>('/api/chat', {
        body: data,
      })
    },
    feedbackStream: (data: FeedbackReplyForm) => {
      return apiClient.post<ReadableStream>('/api/feedback', {
        body: data,
        streamResponse: true,
      })
    }
  }
}

export default api
