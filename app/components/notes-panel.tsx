"use client";

export interface PinnedNote {
  id: string;
  content: string;
  timestamp: Date;
}

interface NotesPanelProps {
  notes: PinnedNote[];
  isOpen: boolean;
  onToggle: () => void;
  onRemove: (id: string) => void;
}

export function NotesPanel({ notes, isOpen, onToggle, onRemove }: NotesPanelProps) {
  return (
    <>
      {/* Collapsed tab */}
      {!isOpen && (
        <button
          onClick={onToggle}
          className="fixed right-0 top-1/2 -translate-y-1/2 z-30
                     bg-[var(--navy-800)] border border-r-0 border-[var(--navy-700)]
                     rounded-l-lg px-2 py-4 text-slate-500 hover:text-amber-400
                     hover:bg-[var(--navy-700)] transition-all group"
          title="Open notes"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="rotate-0">
            <path d="M12 20h9"/><path d="M16.376 3.622a1 1 0 0 1 3.002 3.002L7.368 18.635a2 2 0 0 1-.855.506l-2.872.838a.5.5 0 0 1-.62-.62l.838-2.872a2 2 0 0 1 .506-.854z"/>
          </svg>
          {notes.length > 0 && (
            <span className="absolute -top-1 -left-1 h-4 w-4 rounded-full bg-amber-500 text-[9px] font-bold text-white flex items-center justify-center">
              {notes.length}
            </span>
          )}
        </button>
      )}

      {/* Open panel */}
      {isOpen && (
        <aside className="w-80 shrink-0 border-l border-[var(--navy-700)] bg-[var(--navy-950)]/95 backdrop-blur-xl flex flex-col h-full overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--navy-700)]">
            <div className="flex items-center gap-2">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-400">
                <path d="M12 20h9"/><path d="M16.376 3.622a1 1 0 0 1 3.002 3.002L7.368 18.635a2 2 0 0 1-.855.506l-2.872.838a.5.5 0 0 1-.62-.62l.838-2.872a2 2 0 0 1 .506-.854z"/>
              </svg>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Pinned Notes
              </span>
              {notes.length > 0 && (
                <span className="text-[10px] text-slate-600">({notes.length})</span>
              )}
            </div>
            <button
              onClick={onToggle}
              className="text-slate-600 hover:text-slate-300 transition-colors p-1"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-3 py-3 space-y-3">
            {notes.length === 0 ? (
              <div className="text-center py-12">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-slate-700 mx-auto mb-3">
                  <path d="M12 20h9"/><path d="M16.376 3.622a1 1 0 0 1 3.002 3.002L7.368 18.635a2 2 0 0 1-.855.506l-2.872.838a.5.5 0 0 1-.62-.62l.838-2.872a2 2 0 0 1 .506-.854z"/>
                </svg>
                <p className="text-xs text-slate-600">
                  Pin insights from the chat to save them here.
                </p>
              </div>
            ) : (
              notes.map((note) => (
                <div
                  key={note.id}
                  className="rounded-lg border border-[var(--navy-700)] bg-[var(--navy-900)]/60 p-3 group/note"
                >
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <span className="text-[10px] text-slate-600">
                      {note.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </span>
                    <button
                      onClick={() => onRemove(note.id)}
                      className="opacity-0 group-hover/note:opacity-100 text-slate-600 hover:text-red-400 transition-all"
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                      </svg>
                    </button>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-wrap line-clamp-6">
                    {note.content}
                  </p>
                </div>
              ))
            )}
          </div>
        </aside>
      )}
    </>
  );
}
