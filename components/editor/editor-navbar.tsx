"use client"

import { LayoutTemplate, PanelLeftClose, PanelLeftOpen, Save, Share2, Sparkles } from "lucide-react"
import { UserButton } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { SaveStatus } from "@/hooks/use-canvas-autosave"

interface EditorNavbarProps {
  isOpen: boolean
  onToggle: () => void
  projectName?: string
  isAiSidebarOpen?: boolean
  onToggleAiSidebar?: () => void
  onOpenShareDialog?: () => void
  onOpenTemplates?: () => void
  saveStatus?: SaveStatus
  onSave?: () => void
}

export function EditorNavbar({
  isOpen,
  onToggle,
  projectName,
  isAiSidebarOpen = false,
  onToggleAiSidebar,
  onOpenShareDialog,
  onOpenTemplates,
  saveStatus,
  onSave,
}: EditorNavbarProps) {
  return (
    <header className="flex h-12 shrink-0 items-center justify-between border-b border-[#1e2030] bg-[#0d0e18] px-3">
      <div className="flex min-w-0 items-center gap-2">
        <Button variant="ghost" size="icon" onClick={onToggle} className="shrink-0">
          {isOpen ? (
            <PanelLeftClose className="h-4.5 w-4.5" />
          ) : (
            <PanelLeftOpen className="h-4.5 w-4.5" />
          )}
          <span className="sr-only">Toggle sidebar</span>
        </Button>

        {/* sys/spec wordmark */}
        <span
          className="text-[13px] tracking-tight select-none shrink-0"
          style={{ fontFamily: "var(--font-dm-mono)" }}
        >
          <span className="text-[#eeeeff] opacity-70">sys</span>
          <span style={{ color: "oklch(0.72 0.16 220)" }}>/</span>
          <span className="text-[#606080]">spec</span>
        </span>

        {projectName ? (
          <>
            <span className="text-[#252637] select-none">·</span>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-[#eeeeff]">{projectName}</p>
            </div>
          </>
        ) : null}
      </div>

      <div className="flex items-center gap-1.5">
        {onToggleAiSidebar ? (
          <>
            {onSave ? (
              <Button
                variant="ghost"
                size="sm"
                className="gap-1.5 text-[#a0a0c0] hover:text-[#eeeeff]"
                onClick={onSave}
                disabled={saveStatus === "saving"}
              >
                <Save className="h-3.5 w-3.5" />
                {saveStatus === "saving"
                  ? "Saving…"
                  : saveStatus === "saved"
                  ? "Saved"
                  : saveStatus === "error"
                  ? "Error"
                  : "Save"}
              </Button>
            ) : null}
            {onOpenTemplates ? (
              <Button
                variant="ghost"
                size="sm"
                className="gap-1.5 text-[#a0a0c0] hover:text-[#eeeeff]"
                onClick={onOpenTemplates}
              >
                <LayoutTemplate className="h-3.5 w-3.5" />
                Templates
              </Button>
            ) : null}
            {onOpenShareDialog ? (
              <Button
                variant="ghost"
                size="sm"
                className="gap-1.5 text-[#a0a0c0] hover:text-[#eeeeff]"
                onClick={onOpenShareDialog}
              >
                <Share2 className="h-3.5 w-3.5" />
                Share
              </Button>
            ) : null}

            <Button
              size="sm"
              className={cn(
                "gap-1.5 transition-all",
                isAiSidebarOpen
                  ? "bg-[#6457f9] hover:bg-[#5548e0] text-white border-transparent shadow-[0_0_12px_rgba(100,87,249,0.35)]"
                  : "bg-transparent border border-[#252637] text-[#a0a0c0] hover:border-[#6457f9]/60 hover:text-[#8b82ff] hover:bg-[#6457f9]/8"
              )}
              onClick={onToggleAiSidebar}
            >
              <Sparkles className="h-3.5 w-3.5" />
              AI Architect
            </Button>
          </>
        ) : null}

        {!onToggleAiSidebar ? <UserButton /> : null}
      </div>
    </header>
  )
}
