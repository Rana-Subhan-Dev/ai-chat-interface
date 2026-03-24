/**
 * @file Sidebar.jsx
 * @description Main sidebar component.
 *              Contains:
 *              - App header with logo
 *              - "New Chat" button
 *              - Scrollable conversation history list
 *              - Theme toggle at the bottom
 *
 *              On mobile: slides in from the left as a fixed overlay (z-30).
 *              On desktop (md+): static sidebar, always visible.
 */
import { PlusIcon, SparklesIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useChat } from '@/context/ChatContext';
import ConversationItem from './ConversationItem';
import ThemeToggle from './ThemeToggle';
import { cn } from '@/lib/utils';

export default function Sidebar({ isOpen, onClose }) {
  const { conversations, activeId, createConversation, selectConversation } =
    useChat();

  const handleNewChat = () => {
    createConversation();
    // Close sidebar on mobile after starting a new chat
    if (window.innerWidth < 768) onClose();
  };

  const handleSelect = (id) => {
    selectConversation(id);
    if (window.innerWidth < 768) onClose();
  };

  return (
    <aside
      className={cn(
        // Layout: fixed on mobile, relative on desktop
        'fixed inset-y-0 left-0 z-30 flex h-full w-72 flex-col',
        'bg-[hsl(var(--sidebar-bg))] border-r border-[hsl(var(--sidebar-border))]',
        'transition-transform duration-300 ease-in-out',
        // Slide in/out on mobile
        isOpen ? 'translate-x-0' : '-translate-x-full',
        // Desktop: always visible, no slide
        'md:relative md:translate-x-0 md:flex',
        !isOpen && 'md:hidden' // fully hidden on desktop when collapsed
      )}
    >
      {/* ── Header ───────────────────────────────────────────── */}
      <div className="flex items-center gap-2 px-4 py-5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
          <SparklesIcon className="h-4 w-4 text-primary-foreground" />
        </div>
        <span className="text-base font-semibold tracking-tight">AI Chat</span>
      </div>

      {/* ── New Chat Button ────────────────────────────────────── */}
      <div className="px-3 pb-3">
        <Button
          onClick={handleNewChat}
          className="w-full justify-start gap-2"
          variant="outline"
        >
          <PlusIcon className="h-4 w-4" />
          New conversation
        </Button>
      </div>

      <Separator />

      {/* ── Conversation List ───────────────────────────────────── */}
      <div className="flex-1 overflow-hidden">
        {conversations.length === 0 ? (
          // Empty state for sidebar
          <div className="flex flex-col items-center justify-center h-32 gap-2 px-4 text-center">
            <p className="text-xs text-muted-foreground">
              No conversations yet.
              <br />
              Start one above!
            </p>
          </div>
        ) : (
          <ScrollArea className="h-full py-2">
            <nav className="space-y-0.5 px-2">
              {conversations.map((convo) => (
                <ConversationItem
                  key={convo.id}
                  conversation={convo}
                  isActive={convo.id === activeId}
                  onSelect={handleSelect}
                />
              ))}
            </nav>
          </ScrollArea>
        )}
      </div>

      <Separator />

      {/* ── Footer: Theme Toggle ─────────────────────────────────── */}
      <div className="p-3">
        <ThemeToggle />
      </div>
    </aside>
  );
}
