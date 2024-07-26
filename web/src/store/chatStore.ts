import {create} from 'zustand';
import {createJSONStorage, persist} from 'zustand/middleware';
import api from "@/api";

interface ChatStoreState {
  sourceFileContent: string;
  sourceFileType: string;
  setSourceFileContent: (content: string) => void;
  setSourceFileType: (type: string) => void;
  openFile: () => void;

  snippet: string;
  setSnippet: (snippet: string) => void;

  feedback: string;
  setFeedback: (feedback: string) => void;

  context: string;
  setContext: (context: string) => void;

  chat: string;
  setChat: (chat: string) => void;

  response: string;
  tokens: number;
  setResponse: (response: string) => void;
  clearResponse: () => void;

  submit: () => void;
}

const useChatStore = create<ChatStoreState>()(
  persist(
    (set, get) => ({
      sourceFileContent: "",
      sourceFileType: "",
      setSourceFileContent: (content) => set({ sourceFileContent: content }),
      setSourceFileType: (type) => set({ sourceFileType: type }),
      openFile: () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.*, text/plain';
        input.onchange = async () => {
          const file = input.files?.[0];
          if (!file) return;

          const content = await file.text();
          const fileExtension = file.name.split('.').pop();

          set({ sourceFileContent: content });
          set({ sourceFileType: fileExtension });
        };
        input.click();
      },

      snippet: "",
      setSnippet: (snippet) => set({ snippet }),

      feedback: "",
      setFeedback: (feedback) => set({ feedback }),

      context: "",
      setContext: (context) => set({ context }),

      chat: "",
      setChat: (chat) => set({ chat }),

      response: "",
      tokens: 0,
      setResponse: (response) => set({ response }),
      clearResponse: () => set({ response: "" }),
      setTokens: (tokens: number) => set({ tokens }),

      submit: async () => {
        const response = await api.chat.feedbackStream({
          chat: get().chat,
          context: get().context,
          feedback: get().feedback,
          snippet: get().snippet,
          source: {
            content: get().sourceFileContent,
            type: get().sourceFileType,
          },
        });

        set({ response: "" });
        const reader = response.body.getReader();
        const decoder = new TextDecoder();

        try {
          // eslint-disable-next-line no-constant-condition
          while (true) {
            const { value, done } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value, { stream: true });
            set({ response: get().response + chunk });
          }
        } catch (error) {
          console.error('Error reading response:', error);
        } finally {
          reader.releaseLock();
        }
      },
    }),
    {
      name: 'chat-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useChatStore;
