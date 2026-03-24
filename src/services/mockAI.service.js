/**
 * @file mockAI.service.js
 * @description Simulates an AI assistant's response logic.
 *
 *              In production you would replace getMockResponse() with a real
 *              API call to OpenAI, Anthropic, Gemini, etc.
 *
 *              Current behaviour:
 *              - Checks the user's message against keyword groups
 *              - Returns a contextually relevant response from that group
 *              - Falls back to a set of generic helpful responses
 *              - Responses use markdown so react-markdown renders them nicely
 */

// ─── Response Banks ───────────────────────────────────────────────────

const RESPONSE_MAP = [
  {
    keywords: ['hello', 'hi', 'hey', 'greet', 'good morning', 'good afternoon'],
    responses: [
      "Hey there! 👋 I'm your AI assistant. What would you like to explore today?",
      "Hello! Great to see you. I'm ready to help — what's on your mind?",
      "Hi! I'm here and ready to assist. What can I help you with?",
    ],
  },
  {
    keywords: ['react', 'component', 'hook', 'jsx', 'usestate', 'useeffect', 'props'],
    responses: [
      "Great React question! Here's what I'd recommend:\n\n```jsx\n// Always prefer functional components + hooks\nfunction MyComponent({ title }) {\n  const [count, setCount] = useState(0);\n\n  useEffect(() => {\n    document.title = title;\n  }, [title]);\n\n  return <button onClick={() => setCount(c => c + 1)}>{count}</button>;\n}\n```\n\n**Key principles:**\n- Keep components small and focused\n- Co-locate state as close to where it's used as possible\n- Use `useCallback` and `useMemo` only when you have a measurable perf issue — don't pre-optimise",
      "React hooks changed everything. A few things worth knowing:\n\n- `useState` for local UI state\n- `useReducer` when state logic gets complex\n- `useContext` to avoid prop drilling\n- Custom hooks to share logic across components (not state)\n\nWhat specific React challenge are you working through?",
    ],
  },
  {
    keywords: ['javascript', 'js', 'async', 'await', 'promise', 'closure', 'typescript'],
    responses: [
      "JavaScript is full of sharp edges — let me break that down.\n\n**Async/Await pattern:**\n```js\n// Always wrap in try/catch — unhandled rejections will bite you\nasync function fetchUser(id) {\n  try {\n    const res = await fetch(`/api/users/${id}`);\n    if (!res.ok) throw new Error(`HTTP ${res.status}`);\n    return await res.json();\n  } catch (err) {\n    console.error('Failed to fetch user:', err);\n    throw err; // re-throw so callers can handle it\n  }\n}\n```\n\nWhat part of JS are you working on?",
      "TypeScript is worth the investment — the autocomplete and type safety alone save hours of debugging. What would you like to know?",
    ],
  },
  {
    keywords: ['css', 'tailwind', 'style', 'design', 'layout', 'flexbox', 'grid', 'responsive'],
    responses: [
      "For responsive layouts in Tailwind, the mobile-first approach is the way to go:\n\n```html\n<!-- Start with mobile, then override at larger breakpoints -->\n<div class=\"flex flex-col md:flex-row gap-4\">\n  <aside class=\"w-full md:w-64\">Sidebar</aside>\n  <main class=\"flex-1\">Content</main>\n</div>\n```\n\n**Tailwind tips:**\n- Use `gap-*` instead of margins between flex/grid children\n- `min-h-0` on flex children prevents overflow bugs\n- `truncate` is your friend for text that might overflow",
    ],
  },
  {
    keywords: ['node', 'express', 'api', 'backend', 'server', 'route', 'middleware', 'rest'],
    responses: [
      "Here's a solid Express route structure that scales well:\n\n```js\n// routes/user.routes.js\nimport { Router } from 'express';\nimport { authenticate } from '../middleware/auth.middleware.js';\nimport { getUser, updateUser } from '../controllers/user.controller.js';\nimport { validateUpdateUser } from '../middleware/validate.middleware.js';\n\nconst router = Router();\n\n// Auth middleware applied per-route (more explicit than global)\nrouter.get('/:id', authenticate, getUser);\nrouter.put('/:id', authenticate, validateUpdateUser, updateUser);\n\nexport default router;\n```\n\nAlways validate input before it hits your controller — never trust client data.",
    ],
  },
  {
    keywords: ['mongodb', 'mongoose', 'database', 'schema', 'model', 'query', 'aggregate'],
    responses: [
      "Mongoose schema design tip — always add validation at the model level, not just in the controller:\n\n```js\nconst userSchema = new Schema({\n  email: {\n    type: String,\n    required: [true, 'Email is required'],\n    unique: true,\n    lowercase: true,\n    match: [/^\\S+@\\S+\\.\\S+$/, 'Invalid email format'],\n  },\n  role: {\n    type: String,\n    enum: ['user', 'admin'],\n    default: 'user',\n  },\n}, { timestamps: true }); // adds createdAt + updatedAt automatically\n```\n\nUse `timestamps: true` — you'll almost always need those fields.",
    ],
  },
  {
    keywords: ['auth', 'jwt', 'login', 'token', 'password', 'security', 'authentication'],
    responses: [
      "**JWT Auth best practices:**\n\n1. **Short-lived access tokens** — 15 minutes is a good default\n2. **Refresh token rotation** — issue a new refresh token on every use\n3. **HttpOnly cookies for refresh tokens** — not localStorage (XSS risk)\n4. **Bcrypt for passwords** — cost factor 12 is the current sweet spot\n\n```js\n// NEVER store plain-text passwords\nconst hashed = await bcrypt.hash(password, 12);\n\n// Compare at login\nconst valid = await bcrypt.compare(inputPassword, storedHash);\n```\n\nWhat part of auth are you building?",
    ],
  },
  {
    keywords: ['docker', 'container', 'deploy', 'deployment', 'kubernetes', 'ci', 'devops'],
    responses: [
      "A minimal Docker setup for a Node/React project:\n\n```dockerfile\n# Dockerfile (backend)\nFROM node:20-alpine\nWORKDIR /app\nCOPY package*.json ./\nRUN npm ci --only=production\nCOPY . .\nEXPOSE 5000\nCMD [\"node\", \"src/index.js\"]\n```\n\nAnd for local dev, `docker-compose` is the move — it spins up your API, DB, and any other services in one command. Want me to walk through a full compose setup?",
    ],
  },
  {
    keywords: ['help', 'what can you do', 'capabilities', 'features', 'explain'],
    responses: [
      "I can help you with:\n\n- 💻 **Code** — React, Node.js, JavaScript, TypeScript, Express, MongoDB\n- 🏗️ **Architecture** — How to structure projects, API design, database schemas\n- 🐛 **Debugging** — Walk through problems and find root causes\n- 📖 **Concepts** — Explain how things work, trade-offs between approaches\n- ✍️ **Writing** — README files, documentation, commit messages\n\nJust describe what you're working on and I'll jump in.",
    ],
  },
  {
    keywords: ['thanks', 'thank you', 'appreciate', 'great', 'perfect', 'awesome', 'nice'],
    responses: [
      "Happy to help! 😊 Let me know if anything else comes up.",
      "Glad that was useful! What's next?",
      "Anytime. Don't hesitate to ask if something's unclear.",
    ],
  },
];

/** Fallback responses when no keywords match */
const FALLBACK_RESPONSES = [
  "That's an interesting question. Let me think through it...\n\nI'd need a bit more context to give you the most useful answer. Could you share what you've already tried, or what specific outcome you're aiming for?",
  "Good question. There are a few ways to approach this — the right one depends on your specific constraints.\n\nCould you tell me more about:\n- What stack you're working with?\n- What you've already tried?\n- What the end goal is?",
  "I can help with that. To give you the best answer, could you share a bit more detail? The more context you give me, the more specific and useful I can be.",
  "Hmm, let me think about that carefully.\n\nThere are a few different angles to consider here. What's the core problem you're trying to solve? Sometimes stepping back from the immediate question reveals a simpler path.",
  "Great topic. I have a few thoughts, but I want to make sure I address your actual question — could you expand on what you're trying to achieve?",
];

/**
 * Pick a random item from an array.
 * Used to add variety so responses don't feel repetitive.
 */
function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * @function getMockResponse
 * @description Given a user's message, returns a contextually relevant AI response.
 *              Performs case-insensitive keyword matching across response groups.
 *              Falls back to generic responses if no keywords match.
 *
 * @param {string} userMessage - The raw message typed by the user
 * @returns {string} Markdown-formatted response string
 */
export function getMockResponse(userMessage) {
  const lower = userMessage.toLowerCase();

  // Find the first matching keyword group
  for (const group of RESPONSE_MAP) {
    const matched = group.keywords.some((kw) => lower.includes(kw));
    if (matched) {
      return pickRandom(group.responses);
    }
  }

  // No match — return a generic helpful response
  return pickRandom(FALLBACK_RESPONSES);
}

/**
 * @constant STARTER_PROMPTS
 * @description Shown on the empty state screen as clickable suggestions.
 *              Should be varied to showcase what the AI can help with.
 */
export const STARTER_PROMPTS = [
  {
    icon: '💻',
    label: 'Explain React hooks',
    prompt: 'Can you explain how React hooks work and when to use useEffect vs useCallback?',
  },
  {
    icon: '🔒',
    label: 'JWT authentication guide',
    prompt: 'Walk me through implementing JWT authentication with refresh token rotation in Express.',
  },
  {
    icon: '🏗️',
    label: 'Structure a MERN project',
    prompt: 'What\'s the best folder structure for a production-ready MERN stack application?',
  },
  {
    icon: '🐛',
    label: 'Debug async issues',
    prompt: 'Why do async/await functions sometimes return undefined and how do I debug that?',
  },
  {
    icon: '🚀',
    label: 'Docker + Node.js setup',
    prompt: 'How do I containerise a Node.js Express API with Docker and docker-compose?',
  },
];
