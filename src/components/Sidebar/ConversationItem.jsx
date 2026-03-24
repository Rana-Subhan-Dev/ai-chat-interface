/**
 * @file ConversationItem.jsx
 * @description A single conversation row in the sidebar list.
 *
 *              Features:
 *              - Highlighted when active
 *              - Shows conversation title (auto-generated from first message)
 *              - Shows relative date (Today/Yesterday/date)
 *              - Delete button appears on hover with confirmation dialog
 *
 *              Why AlertDialog for delete?
 *              Destructive actions should always ask for confirmation.
 *              Radix AlertDialog forces the user to make an explicit choice.
 */
import { useState } from 'react';
import { Trash2Icon, MessageSquareIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
} from '@/components/ui/alert-dialog';
import { useChat } from '@/context/ChatContext';
import { formatDate } from '@/lib/utils';
import { cn } from '@/lib/utils';

export default function ConversationItem({ conversation, isActive, onSelect }) {
  const { deleteConversation } = useChat();
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className={cn(
        'group relative flex items-start gap-2 rounded-md px-2 py-2 cursor-pointer',
        'transition-colors duration-150',
        isActive
          ? 'bg-primary/10 text-primary'
          : 'text-foreground hover:bg-accent'
      )}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => onSelect(conversation.id)}
    >
      {/* Icon */}
      <MessageSquareIcon
        className={cn(
          'mt-0.5 h-4 w-4 shrink-0',
          isActive ? 'text-primary' : 'text-muted-foreground'
        )}
      />

      {/* Title + date */}
      <div className="flex-1 overflow-hidden">
        <p className="truncate text-sm font-medium leading-tight">
          {conversation.title}
        </p>
        <p className="text-xs text-muted-foreground mt-0.5">
          {formatDate(conversation.createdAt)}
          {conversation.messages.length > 0 && (
            <span className="ml-1">
              · {conversation.messages.length} msg{conversation.messages.length !== 1 ? 's' : ''}
            </span>
          )}
        </p>
      </div>

      {/* Delete button — visible on hover */}
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              'absolute right-1 top-1 h-7 w-7 shrink-0 transition-opacity duration-150',
              hovered ? 'opacity-100' : 'opacity-0'
            )}
            // Stop click from selecting the conversation
            onClick={(e) => e.stopPropagation()}
          >
            <Trash2Icon className="h-3.5 w-3.5 text-muted-foreground" />
          </Button>
        </AlertDialogTrigger>

        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete conversation?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete &ldquo;{conversation.title}&rdquo;.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => deleteConversation(conversation.id)}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
