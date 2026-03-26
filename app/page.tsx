"use client";

import { useChat } from "@ai-sdk/react";
import { useState, useRef, useEffect, useCallback } from "react";
import { ToolProgressCard } from "./components/tool-progress";
import { MarkdownContent } from "./components/markdown-content";
import {
  ContextualSuggestions,
  STARTER_SUGGESTIONS,
} from "./components/contextual-suggestions";
import { NotesPanel, type PinnedNote } from "./components/notes-panel";

function ActionButton({
  onClick,
  label,
  children,
}: {
  onClick: () => void;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className="opacity-0 group-hover:opacity-100 transition-opacity rounded px-2 py-0.5
                 text-[10px] font-medium text-slate-600 hover:text-amber-400
                 hover:bg-amber-500/10 border border-transparent hover:border-amber-500/20
                 flex items-center gap-1"
      title={label}
    >
      {children}
      <span>{label}</span>
    </button>
  );
}

export default function Chat() {
  const { messages, sendMessage, status } = useChat();
  const [input, setInput] = useState("");
  const [notes, setNotes] = useState<PinnedNote[]>([]);
  const [notesOpen, setNotesOpen] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const isLoading = status === "streaming" || status === "submitted";

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height =
        Math.min(textareaRef.current.scrollHeight, 140) + "px";
    }
  }, [input]);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;
    sendMessage({ text: input });
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleSend = useCallback(
    (text: string) => {
      if (isLoading) return;
      sendMessage({ text });
    },
    [sendMessage, isLoading]
  );

  const pinNote = useCallback((content: string) => {
    const note: PinnedNote = {
      id: crypto.randomUUID(),
      content: content.slice(0, 2000),
      timestamp: new Date(),
    };
    setNotes((prev) => [note, ...prev]);
    setNotesOpen(true);
  }, []);

  const removeNote = useCallback((id: string) => {
    setNotes((prev) => prev.filter((n) => n.id !== id));
  }, []);

  return (
    <div className="flex h-screen">
      <div className="flex flex-col flex-1 min-w-0">
        {/* Header */}
        <header className="flex-none relative">
          <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[var(--arcade-red)]/30 to-transparent" />
          <div className="px-6 py-3.5 bg-[var(--navy-950)]/90 backdrop-blur-xl">
            <div className="max-w-3xl mx-auto flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="relative h-10 w-14 flex items-center justify-center">
                  <svg width="56" height="32" viewBox="0 0 56 32" fill="none" className="absolute inset-0">
                    <polyline
                      points="2,20 10,20 14,8 20,26 26,12 30,20 34,20 38,6 42,24 46,16 50,20 54,20"
                      stroke="url(#pulseGrad)"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="pulse-line-loop"
                      fill="none"
                    />
                    <defs>
                      <linearGradient id="pulseGrad" x1="0" y1="0" x2="56" y2="0" gradientUnits="userSpaceOnUse">
                        <stop offset="0" stopColor="#f59e0b" />
                        <stop offset="0.5" stopColor="#e54666" />
                        <stop offset="1" stopColor="#f59e0b" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 h-2 w-2 rounded-full bg-teal-400 glow-pulse" />
                </div>
                <div>
                  <h1 className="text-base font-bold tracking-tight text-white">
                    Financial Intelligence
                  </h1>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="text-[11px] text-slate-400">Powered by</span>
                    <span className="text-[11px] font-semibold text-sky-400">Tavily</span>
                    <span className="text-[11px] text-slate-500">&</span>
                    <span className="text-[11px] font-semibold text-[var(--arcade-red)]">Arcade</span>
                  </div>
                </div>
              </div>
              <div className="hidden sm:flex items-center gap-1.5 text-[10px] text-slate-300">
                <span className="h-1.5 w-1.5 rounded-full bg-teal-400" />
                <span>29 tools connected</span>
              </div>
            </div>
          </div>
        </header>

        {/* Messages */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-3xl mx-auto px-6 py-6">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center min-h-[65vh] gap-10 animate-fade-in">
                <div className="text-center space-y-5">
                  <div className="mx-auto w-48 h-16 relative">
                    <svg width="192" height="64" viewBox="0 0 192 64" fill="none">
                      <polyline
                        points="4,40 24,40 36,14 52,54 68,24 80,40 92,40 108,10 124,50 140,30 156,40 172,40 188,40"
                        stroke="url(#heroGrad)"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="pulse-line"
                        fill="none"
                      />
                      <defs>
                        <linearGradient id="heroGrad" x1="0" y1="0" x2="192" y2="0" gradientUnits="userSpaceOnUse">
                          <stop offset="0" stopColor="#f59e0b" stopOpacity="0.3" />
                          <stop offset="0.3" stopColor="#f59e0b" />
                          <stop offset="0.5" stopColor="#e54666" />
                          <stop offset="0.7" stopColor="#f59e0b" />
                          <stop offset="1" stopColor="#f59e0b" stopOpacity="0.3" />
                        </linearGradient>
                      </defs>
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold tracking-tight text-white">
                      Pre-Market Intelligence
                    </h2>
                    <p className="mt-3 text-sm text-slate-300 max-w-lg leading-relaxed mx-auto">
                      29 tools authorized, executed, and governed through
                      the <span className="text-[var(--arcade-red)] font-semibold">Arcade</span> MCP
                      runtime. Real-time research powered
                      by <span className="text-sky-400 font-semibold">Tavily</span>.
                    </p>
                  </div>
                  {/* Arcade Runtime container */}
                  <div className="mt-5 flex items-center justify-center gap-2 text-[11px]">
                    <span className="text-slate-500">via</span>
                    <span className="text-[var(--arcade-red)] font-semibold">Arcade</span>
                    <span className="text-slate-600">:</span>
                    <span className="flex items-center gap-1 text-sky-400"><span className="h-1 w-1 rounded-full bg-sky-400" />Tavily</span>
                    <span className="text-slate-700">+</span>
                    <span className="flex items-center gap-1 text-emerald-400"><span className="h-1 w-1 rounded-full bg-emerald-400" />Google Docs</span>
                    <span className="text-slate-700">+</span>
                    <span className="flex items-center gap-1 text-violet-400"><span className="h-1 w-1 rounded-full bg-violet-400" />Slack</span>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-xl">
                  {STARTER_SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      onClick={() => handleSend(s)}
                      className="group text-left text-sm px-5 py-4 rounded-xl border border-[var(--navy-700)]
                                 bg-[var(--navy-900)]/40 hover:bg-[var(--navy-800)] hover:border-amber-500/30
                                 transition-all text-slate-300 hover:text-white"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-5">
                {messages.map((m) => {
                  if (m.role === "user") {
                    const text = m.parts
                      ?.filter((p): p is { type: "text"; text: string } => p.type === "text" && "text" in p)
                      .map((p) => p.text)
                      .join("") || "";
                    return (
                      <div key={m.id} className="flex justify-end animate-fade-in">
                        <div className="max-w-[80%] rounded-2xl rounded-br-sm bg-gradient-to-br from-amber-500/10 to-orange-500/5 border border-amber-500/15 px-5 py-3.5">
                          <p className="text-sm text-slate-200 leading-relaxed">{text}</p>
                        </div>
                      </div>
                    );
                  }

                  const assistantText = m.parts
                    ?.filter((p): p is { type: "text"; text: string } => p.type === "text" && "text" in p)
                    .map((p) => p.text)
                    .join("\n\n") || "";

                  return (
                    <div key={m.id} className="group animate-fade-in">
                      <div className="flex items-center gap-2 mb-2.5">
                        <div className="h-6 w-6 rounded-lg bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center shadow-sm shadow-teal-500/20">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
                          </svg>
                        </div>
                        <span className="text-[11px] font-bold uppercase tracking-widest text-teal-400">
                          Analyst
                        </span>
                        <div className="flex items-center gap-1 ml-auto">
                          {assistantText && (
                            <>
                              <ActionButton onClick={() => pinNote(assistantText)} label="Pin">
                                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <path d="M12 20h9"/><path d="M16.376 3.622a1 1 0 0 1 3.002 3.002L7.368 18.635a2 2 0 0 1-.855.506l-2.872.838a.5.5 0 0 1-.62-.62l.838-2.872a2 2 0 0 1 .506-.854z"/>
                                </svg>
                              </ActionButton>
                              <ActionButton
                                onClick={() => navigator.clipboard.writeText(assistantText)}
                                label="Copy"
                              >
                                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                                </svg>
                              </ActionButton>
                            </>
                          )}
                        </div>
                      </div>

                      <div className="pl-8 space-y-3">
                        {m.parts?.map((part, i) => {
                          if (part.type === "text" && "text" in part && part.text) {
                            return <MarkdownContent key={i} content={part.text} />;
                          }
                          if (part.type.startsWith("tool-") || part.type === "dynamic-tool") {
                            const state = "state" in part ? (part.state as string) : "call";
                            const toolName = "toolName" in part ? (part.toolName as string) : undefined;
                            return (
                              <ToolProgressCard
                                key={i}
                                type={part.type}
                                state={state}
                                toolName={toolName}
                              />
                            );
                          }
                          return null;
                        })}
                      </div>
                    </div>
                  );
                })}

                {isLoading && messages[messages.length - 1]?.role === "user" && (
                  <div className="animate-fade-in">
                    <div className="flex items-center gap-2 mb-2.5">
                      <div className="h-6 w-6 rounded-lg bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
                        </svg>
                      </div>
                      <span className="text-[11px] font-bold uppercase tracking-widest text-teal-400">Analyst</span>
                    </div>
                    <div className="pl-8 space-y-2.5">
                      <div className="h-4 w-48 rounded shimmer" />
                      <div className="h-4 w-72 rounded shimmer" />
                      <div className="h-4 w-36 rounded shimmer" />
                    </div>
                  </div>
                )}
                <div ref={bottomRef} />
              </div>
            )}
          </div>
        </main>

        {/* Input */}
        <footer className="flex-none relative">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[var(--navy-600)]/60 to-transparent" />
          <div className="px-6 py-3 bg-[var(--navy-950)]/90 backdrop-blur-xl">
            <div className="max-w-3xl mx-auto space-y-2">
              <ContextualSuggestions
                messages={messages}
                onSend={handleSend}
                disabled={isLoading}
              />
              <form onSubmit={handleSubmit} className="flex items-center gap-2.5">
                <div className="flex-1 relative">
                  <textarea
                    ref={textareaRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask about markets, companies, or request a briefing..."
                    rows={1}
                    className="w-full resize-none overflow-hidden rounded-xl border border-[var(--navy-700)]
                               bg-[var(--navy-900)]/80 px-4 py-3 text-sm text-slate-100
                               placeholder:text-slate-600 focus:outline-none input-glow transition-shadow"
                    disabled={isLoading}
                  />
                </div>
                <button
                  type="submit"
                  disabled={isLoading || !input.trim()}
                  className="shrink-0 h-[46px] w-[46px] rounded-xl bg-gradient-to-r from-amber-500 to-orange-500
                             flex items-center justify-center shadow-lg shadow-amber-500/20
                             hover:shadow-amber-500/30 hover:from-amber-400 hover:to-orange-400
                             disabled:opacity-30 disabled:shadow-none disabled:cursor-not-allowed transition-all"
                >
                  {isLoading ? (
                    <svg className="animate-spin h-[18px] w-[18px] text-white" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                    </svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
                    </svg>
                  )}
                </button>
              </form>
              <p className="text-center text-[9px] text-slate-500">
                Enter to send | Shift+Enter for new line
              </p>
            </div>
          </div>
        </footer>
      </div>

      <NotesPanel
        notes={notes}
        isOpen={notesOpen}
        onToggle={() => setNotesOpen(!notesOpen)}
        onRemove={removeNote}
      />
    </div>
  );
}
