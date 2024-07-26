import * as React from "react";
import Editor from "@monaco-editor/react";
import {cn} from "@/lib/utils";

export type CodeEditorProps = {
  className?: string;
  value?: string;
  onChange?: (value: string) => void;
  language?: string;
};

const CodeEditor: React.FC<CodeEditorProps> = (props) => {
  return (
    <Editor
      height="100%"
      width="100%"
      className={cn("border", props.className)}
      options={{
        readOnly: false,
        minimap: {
          enabled: false,
        },
        renderValidationDecorations: "off",
        fontSize: 10,
        tabSize: 1,
        wrappingIndent: "indent",
      }}
      value={props.value}
      onChange={(value) => {
        props.onChange?.(value ?? "");
      }}
      language={props.language}
    />
  );
};

export default CodeEditor;
