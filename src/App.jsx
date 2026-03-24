/**
 * @file App.jsx
 * @description Root application component.
 *              Composes the full layout: collapsible sidebar + main chat area.
 *              Manages sidebar open/close state here so both components can react to it.
 */
import { useState } from 'react';
import Sidebar from './components/Sidebar/Sidebar';
import ChatWindow from './components/Chat/ChatWindow';

export default function App() {
  // Controls sidebar visibility — starts open on desktop, closed on mobile
  const [sidebarOpen, setSidebarOpen] = useState(
    () => window.innerWidth >= 768 // md breakpoint
  );

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background text-foreground">
      {/* ── Sidebar ─────────────────────────────────────────── */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* ── Overlay for mobile: tap outside sidebar to close ── */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── Main chat area ──────────────────────────────────── */}
      <main className="flex flex-1 flex-col overflow-hidden">
        <ChatWindow onToggleSidebar={() => setSidebarOpen((o) => !o)} />
      </main>
    </div>
  );
}
