# ✦ AI Chat Interface

A fully-featured AI assistant chat interface built with **React + Vite**, **assistant-ui**, **Tailwind CSS**, and **shadcn/ui** components.

![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite)
![TailwindCSS](https://img.shields.io/badge/Tailwind-3-38BDF8?logo=tailwindcss)

---

## ✨ Features

| Feature | Details |
|---|---|
| 💬 **Sidebar** | Scrollable conversation history, quick switch, delete with confirmation |
| 🌙 **Dark / Light Mode** | Toggle with OS preference auto-detection, persisted to localStorage |
| 🚀 **Empty State** | 5 clickable starter prompts to kickstart any conversation |
| 🤖 **Mock AI** | Keyword-matched responses + realistic 1–3 sec typing delay |
| 💾 **Persistence** | Conversations saved to localStorage (max 50, survives page refresh) |
| 📱 **Responsive** | Mobile-friendly with collapsible sidebar + dark overlay |
| ✍️ **Smart Input** | Auto-expanding textarea, Enter to send, Shift+Enter for newline |
| 📝 **Markdown** | AI responses rendered as markdown with syntax-highlighted code blocks |

---

## 🚀 Quick Start

### 1. Clone the repo
```bash
git clone https://github.com/Rana-Subhan-Dev/ai-chat-interface.git
cd ai-chat-interface
```

### 2. Install dependencies
```bash
npm install
```

### 3. Set up environment variables
```bash
# Copy the example file
cp .env.example .env

# The app works without any env vars (mock AI mode)
# Only needed if you integrate a real AI provider later
```

### 4. Start the dev server
```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) — that's it. ✅

---

## 📁 Project Structure

```
src/
├── components/
│   ├── Chat/
│   │   ├── ChatWindow.jsx       ← Composes entire chat area
│   │   ├── ChatHeader.jsx       ← Title bar + sidebar toggle
│   │   ├── MessageList.jsx      ← Scrollable message history
│   │   ├── MessageBubble.jsx    ← Individual message (user + AI)
│   │   ├── TypingIndicator.jsx  ← Animated "AI is thinking" dots
│   │   ├── EmptyState.jsx       ← Starter prompt cards
│   │   └── ChatInput.jsx        ← Auto-expanding input bar
│   ├── Sidebar/
│   │   ├── Sidebar.jsx          ← Full sidebar layout
│   │   ├── ConversationItem.jsx ← Single conversation row
│   │   └── ThemeToggle.jsx      ← Dark/light switch
│   └── ui/                      ← shadcn/ui base components
│       ├── button.jsx
│       ├── scroll-area.jsx
│       ├── tooltip.jsx
│       ├── separator.jsx
│       └── alert-dialog.jsx
├── context/
│   ├── ThemeContext.jsx          ← Dark/light mode state
│   └── ChatContext.jsx           ← All conversation state + actions
├── hooks/
│   ├── useAutoScroll.js          ← Scroll-to-bottom on new messages
│   └── useLocalStorage.js        ← localStorage-synced useState
├── services/
│   └── mockAI.service.js         ← Mock responses + starter prompts
├── lib/
│   └── utils.js                  ← cn(), formatTime(), formatDate()
├── styles/
│   └── globals.css               ← CSS variables + Tailwind setup
├── App.jsx                        ← Root layout
└── main.jsx                       ← Entry point
```

---

## 🔌 Connecting a Real AI Provider

The mock AI lives entirely in one file: `src/services/mockAI.service.js`

To replace it with a real provider, update the `getMockResponse` function:

### OpenAI Example
```js
// src/services/mockAI.service.js
import OpenAI from 'openai';

const client = new OpenAI({ 
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true // Only for dev — use a backend proxy in production
});

export async function getMockResponse(userMessage) {
  const response = await client.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [{ role: 'user', content: userMessage }],
  });
  return response.choices[0].message.content;
}
```

> ⚠️ **Production note:** Never expose API keys in the browser. Route AI calls through a Node.js backend proxy instead.

### Other Providers
- **Anthropic Claude** — `@anthropic-ai/sdk`
- **Google Gemini** — `@google/generative-ai`
- **Ollama (local)** — `ollama` npm package

---

## 🎨 Theming

All colors are CSS custom properties in `src/styles/globals.css`. Swap the HSL values in `:root` and `.dark` to match your brand instantly.

```css
/* Example: change primary from indigo to emerald */
:root {
  --primary: 160 84% 39%;  /* emerald-600 */
}
```

---

## 📦 Key Dependencies

| Package | Purpose |
|---|---|
| `@assistant-ui/react` | AI chat UI primitives |
| `react-markdown` | Renders AI markdown responses |
| `@radix-ui/*` | Accessible UI primitives (Dialog, ScrollArea, Tooltip) |
| `class-variance-authority` | Variant-based component styling |
| `tailwind-merge` + `clsx` | Safe Tailwind class merging |
| `framer-motion` | Smooth animations |
| `lucide-react` | Icon set |
| `uuid` | Unique IDs for conversations + messages |

---

## 🛠 Available Scripts

```bash
npm run dev       # Start dev server
npm run build     # Production build
npm run preview   # Preview production build locally
npm run lint      # ESLint check
```

---

## 📄 License

MIT — use it, fork it, ship it.
