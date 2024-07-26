import * as React from "react";
import SelectInput from "@/components/input/SelectInput.tsx";
import {Button} from "@/components/ui/button.tsx";
import CodeEditor from "@/components/input/CodeEditor.tsx";
import useChatStore from "@/store/chatStore.ts";
import fileTypes from "@/lib/mime.ts";
import {useMemo} from "react";

const SourceFileInput: React.FC = () => {
  const chatStore = useChatStore()

  const language = useMemo(() => {
    return fileTypes
      .find((type) => type.value === chatStore.sourceFileType)?.label
      .toLowerCase()
  }, [chatStore.sourceFileType])

  return (
    <div className="flex flex-col h-full w-full">
      <div className="flex flex-row space-x-2 justify-end pb-1">
        <SelectInput
          items={fileTypes}
          className="w-[200px] h-[25px]"
          placeholder="Select a file type"
          value={chatStore.sourceFileType}
          onChange={chatStore.setSourceFileType}
        />
        <Button
          size="sm" className="h-full"
          onClick={chatStore.openFile}
        >
          Select
        </Button>
      </div>
      <CodeEditor
        value={chatStore.sourceFileContent}
        onChange={chatStore.setSourceFileContent}
        language={language}
      />
    </div>
  )
}

export default SourceFileInput;
