import * as React from "react";
import useChatStore from "@/store/chatStore.ts";
import Markdown from 'react-markdown'


const ResponseSection: React.FC = () => {

  const chatStore = useChatStore()

  return (
    <div className="p-4 h-full w-full prose">
      <Markdown>
        {chatStore.response}
      </Markdown>
    </div>
  )
}

export default ResponseSection;
