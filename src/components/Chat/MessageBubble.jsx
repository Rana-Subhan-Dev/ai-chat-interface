/**
 * @file MessageBubble.jsx
 * @description Renders a single chat message.
 *
 *              User messages:
 *              - Right-aligned, primary color background, white text
 *
 *              Assistant messages:
 *              - Left-aligned, card background
 *              - Content rendered as Markdown (supports code blocks, bold, etc.)
 *              - AI avatar dot on the left
 *
 *              Why react-markdown?
 *              The mock AI returns formatted markdown. If we later plug in a
 *              real API (GPT, Claude), responses will be markdown too.
 */
import ReactMarkdown from 'react-markdown';
import { SparklesIcon } from 'lucide-react';
import { formatTime } from '@/lib/utils';
import { cn } from '@/lib/utils';

export default function MessageBubble({ message }) {
  const isUser = message.role === 'user';

  return (
    <div
      className={cn(
        'flex w-full animate-fade-in gap-3',
        isUser ? 'justify-end' : 'justify-start'
      )}
    >
      {/* AI avatar — only shown for assistant messages */}
      {!isUser && (
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
          <SparklesIcon className="h-4 w-4 text-primary" />
        </div>
      )}

      {/* Message content bubble */}
      <div
        className={cn(
          'max-w-[80%] rounded-2xl px-4 py-3 text-sm shadow-sm',
          isUser
            ? 'rounded-tr-sm bg-primary text-primary-foreground'
            : 'rounded-tl-sm bg-card border border-border text-card-foreground'
        )}
      >
        {isUser ? (
          // User messages: plain text (no markdown needed)
          <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
        ) : (
          // AI messages: rendered as markdown
          <div className="prose prose-sm dark:prose-invert max-w-none">
            <ReactMarkdown
              components={{
                // Style inline code
                code({ node, inline, className, children, ...props }) {
                  if (inline) {
                    return (
                      <code
                        className="rounded bg-muted px-1 py-0.5 font-mono text-xs"
                        {...props}
                      >
                        {children}
                      </code>
                    );
                  }
                  // Block code
                  return (
                    <pre className="overflow-x-auto rounded-lg bg-muted p-3 text-xs">
                      <code className="font-mono" {...props}>
                        {children}
                      </code>
                    </pre>
                  );
                },
                // Style links to open in a new tab
                a({ href, children }) {
                  return (
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary underline underline-offset-2"
                    >
                      {children}
                    </a>
                  );
                },
              }}
            >
              {message.content}
            </ReactMarkdown>
          </div>
        )}

        {/* Timestamp */}
        <p
          className={cn(
            'mt-1 text-right text-[10px]',
            isUser ? 'text-primary-foreground/60' : 'text-muted-foreground'
          )}
        >
          {formatTime(message.timestamp)}
        </p>
      </div>
    </div>
  );
}
