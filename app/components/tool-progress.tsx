const TOOL_MAP: Record<string, { label: string; pastLabel: string; service: string }> = {
  tavily_search:              { label: "Searching financial news",     pastLabel: "Searched financial news",    service: "Tavily" },
  tavily_research:            { label: "Deep research in progress",   pastLabel: "Completed deep research",    service: "Tavily" },
  tavily_extract:             { label: "Extracting page content",     pastLabel: "Extracted page content",     service: "Tavily" },
  tavily_crawl:               { label: "Crawling website",            pastLabel: "Crawled website",            service: "Tavily" },
  tavily_map:                 { label: "Mapping site structure",      pastLabel: "Mapped site structure",      service: "Tavily" },
  tavily_skill:               { label: "Searching documentation",     pastLabel: "Searched documentation",     service: "Tavily" },
  CreateDocumentFromText:     { label: "Creating Google Doc",         pastLabel: "Created Google Doc",         service: "Google Docs" },
  CreateBlankDocument:        { label: "Creating blank document",     pastLabel: "Created blank document",     service: "Google Docs" },
  EditDocument:               { label: "Editing document",            pastLabel: "Edited document",            service: "Google Docs" },
  GetDocumentAsDocmd:         { label: "Reading document",            pastLabel: "Read document",              service: "Google Docs" },
  SearchDocuments:            { label: "Searching Google Drive",      pastLabel: "Searched Google Drive",      service: "Google Docs" },
  SearchAndRetrieveDocuments: { label: "Searching & retrieving docs", pastLabel: "Retrieved docs",             service: "Google Docs" },
  InsertTextAtEndOfDocument:  { label: "Appending to document",       pastLabel: "Appended to document",       service: "Google Docs" },
  CommentOnDocument:          { label: "Commenting on doc",           pastLabel: "Commented on doc",           service: "Google Docs" },
  GetDocumentMetadata:        { label: "Reading doc metadata",        pastLabel: "Read doc metadata",          service: "Google Docs" },
  GenerateGoogleFilePickerUrl:{ label: "Generating file picker",      pastLabel: "Generated file picker",      service: "Google Docs" },
  SendMessage:                { label: "Posting to Slack",            pastLabel: "Posted to Slack",            service: "Slack" },
  GetMessages:                { label: "Reading Slack messages",      pastLabel: "Read Slack messages",        service: "Slack" },
  GetThreadMessages:          { label: "Reading thread messages",     pastLabel: "Read thread messages",       service: "Slack" },
  ListConversations:          { label: "Listing channels",            pastLabel: "Listed channels",            service: "Slack" },
  ListUsers:                  { label: "Listing users",               pastLabel: "Listed users",               service: "Slack" },
  GetUsersInfo:               { label: "Looking up user info",        pastLabel: "Looked up user info",        service: "Slack" },
  GetConversationMetadata:    { label: "Reading channel metadata",    pastLabel: "Read channel metadata",      service: "Slack" },
  GetUsersInConversation:     { label: "Listing channel members",     pastLabel: "Listed channel members",     service: "Slack" },
  InviteUsersToChannel:       { label: "Inviting to channel",         pastLabel: "Invited to channel",         service: "Slack" },
  WhoAmI:                     { label: "Checking account info",       pastLabel: "Checked account info",       service: "Arcade" },
};

function parseTool(rawType: string, toolName?: string): { label: string; pastLabel: string; service: string } {
  const name = toolName || rawType.replace("tool-", "");
  const cleaned = name
    .replace(/^Tavily_/i, "")
    .replace(/^GoogleDocs_/i, "")
    .replace(/^Slack_/i, "");

  for (const [key, meta] of Object.entries(TOOL_MAP)) {
    if (cleaned.includes(key)) return meta;
  }

  if (name.toLowerCase().includes("tavily")) return { label: cleaned, pastLabel: cleaned, service: "Tavily" };
  if (name.toLowerCase().includes("doc"))    return { label: cleaned, pastLabel: cleaned, service: "Google Docs" };
  if (name.toLowerCase().includes("slack"))  return { label: cleaned, pastLabel: cleaned, service: "Slack" };
  return { label: cleaned, pastLabel: cleaned, service: "Arcade" };
}

function ServiceIcon({ service }: { service: string }) {
  const cls = "w-3.5 h-3.5 shrink-0";
  if (service === "Tavily") return (
    <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
    </svg>
  );
  if (service === "Google Docs") return (
    <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
    </svg>
  );
  if (service === "Slack") return (
    <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="8" height="2" rx="1"/><rect x="13" y="11" width="8" height="2" rx="1"/><rect x="11" y="3" width="2" height="8" rx="1"/><rect x="11" y="13" width="2" height="8" rx="1"/>
    </svg>
  );
  return (
    <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
    </svg>
  );
}

const SERVICE_STYLES: Record<string, { border: string; bg: string; text: string; dot: string }> = {
  "Tavily":      { border: "border-sky-500/25", bg: "bg-sky-500/5",     text: "text-sky-400",     dot: "bg-sky-400" },
  "Google Docs": { border: "border-emerald-500/25", bg: "bg-emerald-500/5", text: "text-emerald-400", dot: "bg-emerald-400" },
  "Slack":       { border: "border-violet-500/25", bg: "bg-violet-500/5",  text: "text-violet-400",  dot: "bg-violet-400" },
  "Arcade":      { border: "border-[var(--arcade-red)]/25", bg: "bg-[var(--arcade-red)]/5",  text: "text-[var(--arcade-red)]",   dot: "bg-[var(--arcade-red)]" },
};

interface ToolProgressProps {
  type: string;
  state: string;
  toolName?: string;
}

export function ToolProgressCard({ type, state, toolName }: ToolProgressProps) {
  const { label, pastLabel, service } = parseTool(type, toolName);
  const isDone = state === "result" || state === "output-available";
  const s = SERVICE_STYLES[service] || SERVICE_STYLES["Arcade"];

  if (isDone) {
    return (
      <div className={`inline-flex items-center gap-2 rounded-lg ${s.border} ${s.bg} border px-3 py-1.5`}>
        <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />
        <span className={`${s.text}`}><ServiceIcon service={service} /></span>
        <span className="text-xs text-slate-300">{pastLabel}</span>
        <span className="text-[10px] text-slate-400">using <span className={s.text}>{service}</span> via <span className="text-[var(--arcade-red)]">Arcade</span></span>
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-3 rounded-xl ${s.border} ${s.bg} border px-4 py-3 animate-fade-in`}>
      <div className={`${s.text} animate-pulse`}>
        <ServiceIcon service={service} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 flex-wrap text-sm">
          <span className="text-white font-medium">{label}</span>
          <span className="text-[10px] text-slate-400">using <span className={s.text}>{service}</span> via <span className="text-[var(--arcade-red)]">Arcade</span></span>
        </div>
        <div className="mt-2 h-1 w-full rounded-full overflow-hidden bg-[var(--navy-800)]">
          <div className="h-full rounded-full shimmer" style={{ width: "100%" }} />
        </div>
      </div>
    </div>
  );
}
