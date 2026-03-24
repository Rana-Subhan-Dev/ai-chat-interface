/**
 * @file ChatContext.jsx
 * @description Central state manager for all conversations.
 *
 *              Responsibilities:
 *              - Stores the list of all conversations (array of conversation objects)
 *              - Tracks which conversation is currently active
 *              - Provides actions: createConversation, selectConversation,
 *                deleteConversation, sendMessage
 *              - Persists everything to localStorage (with 50-conversation cap)
 *              - Simulates AI responses with realistic typing delay (1–3 seconds)
 *
 *              Data shape:
 *              Conversation: {
 *                id: string (uuid),
 *                title: string (auto-generated from first message),
 *                createdAt: ISO date string,
 *                messages: Message[]
 *              }
 *              Message: {
 *                id: string (uuid),
 *                role: 'user' | 'assistant',
 *                content: string,
 *                timestamp: ISO date string
 *              }
 */
import {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
} from 'react';
import { v4 as uuidv4 } from 'uuid';
import { getMockResponse } from '../services/mockAI.service';

// ─── Constants ──────────────────────────────────────────────────────────
const STORAGE_KEY = 'ai-chat-conversations';
const MAX_CONVERSATIONS = 50;

// ─── Helpers ───────────────────────────────────────────────────────────

/** Load conversations from localStorage, return empty array if nothing saved */
function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    // Corrupted data — start fresh
    return [];
  }
}

/** Persist conversations to localStorage */
function saveToStorage(conversations) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(conversations));
  } catch {
    // localStorage quota exceeded — silently fail (data still in memory)
    console.warn('localStorage quota exceeded — conversation not persisted.');
  }
}

/**
 * Generate a short conversation title from the first user message.
 * Truncates to 40 characters with ellipsis if needed.
 */
function generateTitle(message) {
  const clean = message.trim();
  return clean.length > 40 ? `${clean.slice(0, 40)}…` : clean;
}

// ─── Context ──────────────────────────────────────────────────────────
const ChatContext = createContext(null);

export function ChatProvider({ children }) {
  const [conversations, setConversations] = useState(() => loadFromStorage());
  const [activeId, setActiveId] = useState(() => {
    const saved = loadFromStorage();
    return saved.length > 0 ? saved[0].id : null;
  });
  // Track which conversation IDs are currently awaiting an AI response
  const [loadingIds, setLoadingIds] = useState(new Set());

  // Ref to always have latest conversations in async callbacks
  const conversationsRef = useRef(conversations);
  conversationsRef.current = conversations;

  /** Persist and update state together — single source of truth */
  const persist = useCallback((updated) => {
    setConversations(updated);
    saveToStorage(updated);
  }, []);

  /** Create a brand-new empty conversation and make it active */
  const createConversation = useCallback(() => {
    const newConvo = {
      id: uuidv4(),
      title: 'New conversation',
      createdAt: new Date().toISOString(),
      messages: [],
    };

    // Prepend new conversation and respect the 50-item cap
    const updated = [newConvo, ...conversationsRef.current].slice(
      0,
      MAX_CONVERSATIONS
    );
    persist(updated);
    setActiveId(newConvo.id);
    return newConvo.id;
  }, [persist]);

  /** Switch to a different conversation by ID */
  const selectConversation = useCallback((id) => {
    setActiveId(id);
  }, []);

  /** Delete a conversation — if it was active, switch to the next available one */
  const deleteConversation = useCallback(
    (id) => {
      const updated = conversationsRef.current.filter((c) => c.id !== id);
      persist(updated);

      // If deleted conversation was active, select the first remaining one
      if (activeId === id) {
        setActiveId(updated.length > 0 ? updated[0].id : null);
      }
    },
    [activeId, persist]
  );

  /**
   * Send a user message and trigger a mock AI response.
   * Flow:
   * 1. Add user message to conversation immediately.
   * 2. Mark conversation as loading (shows typing indicator).
   * 3. Wait for a realistic delay (1–3 seconds).
   * 4. Add the AI response and remove loading state.
   */
  const sendMessage = useCallback(
    async (conversationId, content) => {
      if (!content.trim()) return;

      const userMessage = {
        id: uuidv4(),
        role: 'user',
        content: content.trim(),
        timestamp: new Date().toISOString(),
      };

      // Step 1: Add user message immediately
      setConversations((prev) => {
        const updated = prev.map((c) => {
          if (c.id !== conversationId) return c;
          const isFirstMessage = c.messages.length === 0;
          return {
            ...c,
            // Auto-title from first message
            title: isFirstMessage ? generateTitle(content) : c.title,
            messages: [...c.messages, userMessage],
          };
        });
        saveToStorage(updated);
        return updated;
      });

      // Step 2: Show typing indicator
      setLoadingIds((prev) => new Set(prev).add(conversationId));

      // Step 3: Simulate AI thinking time (1–3 seconds)
      const delay = 1000 + Math.random() * 2000;
      await new Promise((resolve) => setTimeout(resolve, delay));

      // Step 4: Add AI response
      const aiMessage = {
        id: uuidv4(),
        role: 'assistant',
        content: getMockResponse(content),
        timestamp: new Date().toISOString(),
      };

      setConversations((prev) => {
        const updated = prev.map((c) =>
          c.id !== conversationId
            ? c
            : { ...c, messages: [...c.messages, aiMessage] }
        );
        saveToStorage(updated);
        return updated;
      });

      // Remove loading state
      setLoadingIds((prev) => {
        const next = new Set(prev);
        next.delete(conversationId);
        return next;
      });
    },
    []
  );

  // Derive the currently active conversation object
  const activeConversation =
    conversations.find((c) => c.id === activeId) ?? null;

  return (
    <ChatContext.Provider
      value={{
        conversations,
        activeId,
        activeConversation,
        loadingIds,
        createConversation,
        selectConversation,
        deleteConversation,
        sendMessage,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

/** Custom hook — use in any component that needs chat state or actions */
export function useChat() {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error('useChat must be used inside <ChatProvider>');
  return ctx;
}
