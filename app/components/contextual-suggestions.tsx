import type { UIMessage } from "ai";

const STARTER_SUGGESTIONS = [
  "Research NVDA: what happened in the last 24 hours?",
  "Compare MSFT and GOOGL on their latest AI investments",
  "Prepare a pre-market brief for TSLA, AAPL, and AMZN",
  "What are analysts saying about the semiconductor sector?",
];

function deriveContextualSuggestions(messages: UIMessage[]): string[] {
  if (messages.length === 0) return STARTER_SUGGESTIONS;

  const lastAssistant = [...messages].reverse().find((m) => m.role === "assistant");
  if (!lastAssistant) return STARTER_SUGGESTIONS;

  const hasDoc = lastAssistant.parts?.some(
    (p) => p.type.includes("GoogleDocs") || p.type.includes("Doc")
  );
  const hasSlack = lastAssistant.parts?.some(
    (p) => p.type.includes("Slack")
  );
  const hasResearch = lastAssistant.parts?.some(
    (p) => p.type.includes("tavily") || p.type.includes("Tavily")
  );

  if (hasSlack) {
    return [
      "Research another company",
      "Update the briefing with latest data",
      "Compare two stocks head-to-head",
    ];
  }
  if (hasDoc) {
    return [
      "Share this doc summary on Slack",
      "Research another company",
      "Add more analysis to the document",
    ];
  }
  if (hasResearch) {
    return [
      "Create a Google Doc with this analysis",
      "Share a summary on Slack",
      "Dig deeper into SEC filings",
      "Compare with a competitor",
    ];
  }
  return [
    "Create a Google Doc with this briefing",
    "Share summary on Slack",
    "Research a specific company",
  ];
}

interface ContextualSuggestionsProps {
  messages: UIMessage[];
  onSend: (text: string) => void;
  disabled?: boolean;
}

export function ContextualSuggestions({ messages, onSend, disabled }: ContextualSuggestionsProps) {
  const suggestions = deriveContextualSuggestions(messages);
  if (messages.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-1.5 pb-1.5">
      {suggestions.map((s) => (
        <button
          key={s}
          disabled={disabled}
          onClick={() => onSend(s)}
          className="rounded-lg border border-[var(--navy-700)] bg-[var(--navy-900)]/50
                     px-3 py-1.5 text-[11px] text-slate-400 hover:text-amber-300 hover:border-amber-500/30
                     hover:bg-amber-500/5 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {s}
        </button>
      ))}
    </div>
  );
}

export { STARTER_SUGGESTIONS };
