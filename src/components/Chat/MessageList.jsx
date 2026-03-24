/**
 * @file MessageList.jsx
 * @description Renders the list of messages for the active conversation.
 *              - User messages aligned right (blue bubble)
 *              - AI messages aligned left (subtle card)
 *              - Typing indicator shown while AI is "thinking"
 *              - Auto-scrolls to bottom when new messages arrive
 */
import { useChat } from '@/context/ChatContext';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAutoScroll } from '@/hooks/useAutoScroll';
import MessageBubble from './MessageBubble';
import TypingIndicator from './TypingIndicator';

export default function MessageList({ conversation }) {
  const { loadingIds } = useChat();

  // Auto-scroll triggers on message count change
  const bottomRef = useAutoScroll(conversation.messages.length);

  // Is the AI currently generating a response for this conversation?
  const isTyping = loadingIds.has(conversation.id);

  return (
    <ScrollArea className="h-full">
      <div className="mx-auto max-w-3xl space-y-6 px-4 py-6">
        {conversation.messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}

        {/* Typing indicator — only shown while AI is responding */}
        {isTyping && <TypingIndicator />}

        {/* Invisible sentinel element — we scroll to this */}
        <div ref={bottomRef} />
      </div>
    </ScrollArea>
  );
}
