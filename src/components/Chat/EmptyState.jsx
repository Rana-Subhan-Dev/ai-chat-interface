/**
 * @file EmptyState.jsx
 * @description Shown when a conversation has no messages yet.
 *
 *              Layout:
 *              - Centered welcome message with icon
 *              - 5 clickable starter prompt cards
 *
 *              When a prompt card is clicked:
 *              - The prompt text is sent as the user's first message
 *              - ChatWindow handles creating the conversation and sending
 *
 *              Starter prompts are defined in mockAI.service.js so they
 *              stay in sync with what the mock AI can respond to.
 */
import { SparklesIcon } from 'lucide-react';
import { STARTER_PROMPTS } from '@/services/mockAI.service';

export default function EmptyState({ onPromptSelect }) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-8 px-4 py-12">
      {/* Welcome heading */}
      <div className="flex flex-col items-center gap-3 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
          <SparklesIcon className="h-7 w-7 text-primary" />
        </div>
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">
            How can I help you today?
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Ask me anything — or pick a suggestion below to get started.
          </p>
        </div>
      </div>

      {/* Starter prompt cards */}
      <div className="grid w-full max-w-2xl grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {STARTER_PROMPTS.map((item) => (
          <button
            key={item.label}
            onClick={() => onPromptSelect(item.prompt)}
            className="group flex flex-col gap-2 rounded-xl border border-border bg-card p-4 text-left shadow-sm transition-all duration-150 hover:border-primary/50 hover:bg-accent hover:shadow-md"
          >
            <span className="text-2xl">{item.icon}</span>
            <span className="text-sm font-medium group-hover:text-primary">
              {item.label}
            </span>
            <span className="line-clamp-2 text-xs text-muted-foreground">
              {item.prompt}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
