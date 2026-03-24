/**
 * @file ChatInput.jsx
 * @description The message input bar at the bottom of the chat window.
 *
 *              Features:
 *              - Auto-expanding textarea (grows with content, max 5 rows)
 *              - Send on Enter key (Shift+Enter for newline)
 *              - Send button disabled when empty or AI is typing
 *              - Loading state on send button while waiting for AI
 *              - Character count in corner (optional UX touch)
 *
 *              Why textarea instead of input?
 *              Long prompts are common in AI interfaces. A textarea that
 *              grows with content is much more usable.
 */
import { useState, useRef, useEffect } from 'react';
import { SendHorizonalIcon, LoaderIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useChat } from '@/context/ChatContext';
import { cn } from '@/lib/utils';

export default function ChatInput({ onSend }) {
  const [value, setValue] = useState('');
  const textareaRef = useRef(null);
  const { activeId, loadingIds } = useChat();

  // Check if this conversation is currently waiting for an AI response
  const isLoading = activeId ? loadingIds.has(activeId) : false;
  const canSend = value.trim().length > 0 && !isLoading;

  /** Auto-resize textarea height based on content */
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto'; // Reset first
    el.style.height = `${Math.min(el.scrollHeight, 140)}px`; // Max ~5 rows
  }, [value]);

  const handleSend = () => {
    if (!canSend) return;
    onSend(value.trim());
    setValue('');
    // Reset textarea height after clearing
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e) => {
    // Enter sends, Shift+Enter creates a newline
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="shrink-0 border-t bg-background px-4 py-3">
      <div className="mx-auto max-w-3xl">
        <div
          className={cn(
            'flex items-end gap-2 rounded-2xl border bg-background px-4 py-2',
            'transition-colors duration-150',
            'focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary/20'
          )}
        >
          {/* Auto-expanding textarea */}
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={isLoading ? 'AI is thinking…' : 'Ask anything… (Enter to send, Shift+Enter for new line)'}
            disabled={isLoading}
            rows={1}
            className={cn(
              'flex-1 resize-none bg-transparent py-1.5 text-sm outline-none',
              'placeholder:text-muted-foreground',
              'disabled:cursor-not-allowed disabled:opacity-50',
              'max-h-[140px] min-h-[36px]'
            )}
          />

          {/* Send button */}
          <Button
            size="icon"
            onClick={handleSend}
            disabled={!canSend}
            className="mb-0.5 h-8 w-8 shrink-0 rounded-xl"
            aria-label="Send message"
          >
            {isLoading ? (
              <LoaderIcon className="h-4 w-4 animate-spin" />
            ) : (
              <SendHorizonalIcon className="h-4 w-4" />
            )}
          </Button>
        </div>

        {/* Helper text */}
        <p className="mt-1.5 text-center text-[11px] text-muted-foreground">
          AI responses are simulated. Replace{' '}
          <code className="rounded bg-muted px-1 font-mono">mockAI.service.js</code>{' '}
          to connect a real AI provider.
        </p>
      </div>
    </div>
  );
}
