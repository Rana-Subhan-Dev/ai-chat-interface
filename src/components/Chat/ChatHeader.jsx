/**
 * @file ChatHeader.jsx
 * @description Top bar of the chat window.
 *              - Hamburger button to toggle the sidebar (visible on all sizes)
 *              - Current conversation title (or default text)
 *              - Subtle border and background to separate from message area
 */
import { MenuIcon, SparklesIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useChat } from '@/context/ChatContext';

export default function ChatHeader({ onToggleSidebar }) {
  const { activeConversation } = useChat();

  const title = activeConversation?.title ?? 'New conversation';

  return (
    <header className="flex h-14 shrink-0 items-center gap-3 border-b bg-background/80 px-4 backdrop-blur-sm">
      {/* Sidebar toggle — always visible so user can open/close sidebar */}
      <Button
        variant="ghost"
        size="icon"
        onClick={onToggleSidebar}
        className="text-muted-foreground hover:text-foreground"
        aria-label="Toggle sidebar"
      >
        <MenuIcon className="h-5 w-5" />
      </Button>

      {/* Conversation title */}
      <div className="flex flex-1 items-center gap-2 overflow-hidden">
        <SparklesIcon className="h-4 w-4 shrink-0 text-primary" />
        <h1 className="truncate text-sm font-medium">{title}</h1>
      </div>
    </header>
  );
}
