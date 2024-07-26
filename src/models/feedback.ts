import {z} from "zod";

export const feedbackReplyFormSchema = z.object({
  source: z.object({
    type: z.string(),
    content: z.string(),
  }),
  snippet: z.string(),
  feedback: z.string(),
  context: z.string(),
  chat: z.string(),
});
export type FeedbackReplyForm = z.infer<typeof feedbackReplyFormSchema>;
