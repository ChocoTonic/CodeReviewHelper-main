import { createFileRoute } from '@tanstack/react-router'
import {ResizableHandle, ResizablePanel, ResizablePanelGroup} from "../components/ui/resizable.tsx";
import PromptSection from "./-comps/PromptSection.tsx";
import ResponseSection from "@/routes/-comps/ResponseSection.tsx";

export const Route = createFileRoute('/')({
  component: RootPage
})

function RootPage() {
  return (
    <div className="h-screen w-screen py-4 px-6">
      <ResizablePanelGroup
        direction="horizontal"
        className="border"
      >
        <ResizablePanel defaultSize={60}>
          <PromptSection />
        </ResizablePanel>
        <ResizableHandle withHandle={true} />
        <ResizablePanel defaultSize={40}>
          <ResponseSection />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  )
}
