import * as React from "react";
import {Accordion, AccordionContent, AccordionItem, AccordionTrigger} from "../../components/ui/accordion.tsx";
import {Button} from "@/components/ui/button.tsx";
import {Textarea} from "@/components/ui/textarea.tsx";
import {ScrollArea} from "@/components/ui/scroll-area.tsx";
import SourceFileInput from "@/routes/-comps/SourceFileInput.tsx";
import useChatStore from "@/store/chatStore.ts";


const PromptSection: React.FC = () => {
  const chatStore = useChatStore()

  return (
    <ScrollArea  className="w-full h-full flex flex-col py-1 px-4">
      <Accordion type="multiple" className="w-full">
        <AccordionItem value="files">
          <AccordionTrigger className="text-sm">Source File</AccordionTrigger>
          <AccordionContent className="h-[600px]">
            <SourceFileInput />
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="snippet">
          <AccordionTrigger className="text-sm">Snippet</AccordionTrigger>
          <AccordionContent>
            <Textarea
              value={chatStore.snippet}
              onChange={(e) => chatStore.setSnippet(e.target.value)}
            />
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="feedback">
          <AccordionTrigger className="text-sm">Feedback</AccordionTrigger>
          <AccordionContent>
            <Textarea
              value={chatStore.feedback}
              onChange={(e) => chatStore.setFeedback(e.target.value)}
            />
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="context">
          <AccordionTrigger className="text-sm">Context</AccordionTrigger>
          <AccordionContent>
            <Textarea
              value={chatStore.context}
              onChange={(e) => chatStore.setContext(e.target.value)}
            />
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="chat">
          <AccordionTrigger className="text-sm">Chat</AccordionTrigger>
          <AccordionContent>
            <Textarea
              value={chatStore.chat}
              onChange={(e) => chatStore.setChat(e.target.value)}
            />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      <div className="flex flex-row justify-end items-end pt-2 pb-1">
        <Button onClick={chatStore.submit}>Submit</Button>
      </div>
    </ScrollArea>
  )
}

export default PromptSection;
