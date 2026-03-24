/**
 * @file TypingIndicator.jsx
 * @description Animated "AI is typing" indicator.
 *              Shows three pulsing dots in an AI bubble while waiting for a response.
 *              The staggered animation (via CSS delay) makes it look realistic.
 */
import { SparklesIcon } from 'lucide-react';

export default function TypingIndicator() {
  return (
    <div className="flex animate-fade-in items-start gap-3">
      {/* Match AI avatar style from MessageBubble */}
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
        <SparklesIcon className="h-4 w-4 text-primary" />
      </div>

      {/* Typing bubble */}
      <div className="rounded-2xl rounded-tl-sm border border-border bg-card px-4 py-3">
        <div className="flex items-center gap-1">
          {/* Three staggered dots — CSS delays set in globals.css */}
          <span className="typing-dot" />
          <span className="typing-dot" />
          <span className="typing-dot" />
        </div>
      </div>
    </div>
  );
}
