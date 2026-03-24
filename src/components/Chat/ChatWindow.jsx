/**
 * @file ChatWindow.jsx
 * @description The main chat area — composes all chat sub-components.
 *
 *              Layout (top to bottom):
 *              1. ChatHeader  — title + sidebar toggle button
 *              2. MessageList — scrollable messages area OR empty state
 *              3. ChatInput   — sticky message input bar
 *
 *              Routing logic:
 *              - No active conversation — creates one on first message send
 *              - Active conversation — sends to existing conversation
 */
import { useChat } from '@/context/ChatContext';
import ChatHeader from './ChatHeader';
import MessageList from './MessageList';
import EmptyState from './EmptyState';
import ChatInput from './ChatInput';

export default function ChatWindow({ onToggleSidebar }) {
  const { activeConversation, activeId, createConversation, sendMessage } =
    useChat();

  /**
   * Handle sending a message.
   * If there's no active conversation yet, create one first.
   * This allows users to type straight away without clicking "New Chat".
   */
  const handleSend = async (content) => {
    let targetId = activeId;

    if (!targetId) {
      // Auto-create a conversation when user sends first message
      targetId = createConversation();
    }

    await sendMessage(targetId, content);
  };

  const hasMessages =
    activeConversation && activeConversation.messages.length > 0;

  return (
    <div className="flex h-full flex-col">
      {/* Top bar — shows conversation title and sidebar toggle */}
      <ChatHeader onToggleSidebar={onToggleSidebar} />

      {/* Message area — fills remaining space and scrolls */}
      <div className="flex-1 overflow-hidden">
        {hasMessages ? (
          <MessageList conversation={activeConversation} />
        ) : (
          // Empty state shown when no messages exist yet
          <EmptyState onPromptSelect={handleSend} />
        )}
      </div>

      {/* Sticky input bar at the bottom */}
      <ChatInput onSend={handleSend} />
    </div>
  );
}
