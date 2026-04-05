# Lexica AI

**Lexica** is a browser-based AI chat application built with React and TypeScript. It connects to the **OpenAI Chat Completions API** so you can have multi-turn conversations, pick models, prefer a response language, and keep your history on your device. The interface is designed for both desktop and mobile, with a dark or light theme.

---

## Table of contents

1. [What this project does](#what-this-project-does)
2. [Features](#features)
3. [Technology stack](#technology-stack)
4. [Architecture overview](#architecture-overview)
5. [Prerequisites](#prerequisites)
6. [Installation](#installation)
7. [Running the app](#running-the-app)
8. [Configuration](#configuration)
9. [Building for production](#building-for-production)
10. [Data storage and privacy](#data-storage-and-privacy)
11. [Security notes](#security-notes)
12. [Scripts reference](#scripts-reference)
13. [Project structure](#project-structure)
14. [Limitations and known behaviors](#limitations-and-known-behaviors)
15. [Troubleshooting](#troubleshooting)

---

## What this project does

Lexica runs entirely as a **single-page application (SPA)** in your browser. You paste your own **OpenAI API key** in Settings; the app uses it to call OpenAI’s servers and stream assistant replies token by token. Conversations, messages, theme, language, model, and API key are **saved in the browser** (`localStorage`) so your session survives refreshes.

There is **no custom backend** in this repository: the browser talks to OpenAI directly using the official `openai` JavaScript SDK (with browser usage explicitly enabled in code).

---

## Features

### Chat and AI

- **Streaming replies** — Assistant messages appear progressively as the model generates text.
- **Multi-turn context** — Each request includes the prior messages in the current conversation (same as typical chat UIs).
- **Model selection** — Choose among:
  - `gpt-4o-mini` (default)
  - `gpt-4o`
  - `gpt-4-turbo`
  - `gpt-3.5-turbo`
- **Response language** — If you pick a language other than English in Settings, a **system instruction** asks the model to reply in that language (see [languages list](src/utils/languages.ts)).
- **Error handling** — User-facing messages for common API issues (e.g. invalid key, rate limit, server errors).

### Conversations

- **Multiple conversations** — Create, switch, and delete conversations from the sidebar.
- **Auto-generated titles** — The first user message (text) seeds the conversation title (first few words).
- **Search** — Filter conversations by title or by text inside any message.
- **Reset chat** — Clears messages in the **current** conversation only (does not delete the conversation row).

### User interface

- **Light and dark themes** — Toggle from the sidebar; layout and colors adapt.
- **Welcome screen** — When a chat is empty, you see a hero section, feature cards, and **suggestion buttons** that send a starter prompt for you.
- **Code in messages** — Markdown-style fenced code blocks (`` ``` ``) are rendered with a header and a **per-block copy** button.
- **Copy assistant text** — Copy the full assistant message from a hover action.
- **Typing / streaming affordances** — Indicators while the model is generating.
- **Responsive layout** — Sidebar is a **drawer on small screens** (menu button); full width sidebar on `md` and up.

### Input

- **Multiline input** — Textarea auto-grows; **Enter** sends, **Shift+Enter** adds a new line.
- **Attachments (UI)** — You can attach generic files or images; they are shown in the user message (previews for images, links for others). **Important:** In the current implementation, **file contents are not sent to the OpenAI API** — only text in `messages` is used for completion. See [Limitations](#limitations-and-known-behaviors).

### Export

- **Export PDF** — Exports the **current** conversation to a `.pdf` file (title, export date, and each message with role label and timestamp). Implemented with **jsPDF**.

### Settings

- **OpenAI API key** — Stored locally; optional show/hide toggle.
- **Model**, **language**, and persisted **theme** (via global app state saved to `localStorage`).

---

## Technology stack

| Area | Technology |
|------|------------|
| UI library | [React 18](https://react.dev/) |
| Language | [TypeScript](https://www.typescriptlang.org/) |
| Build tool | [Vite](https://vitejs.dev/) |
| Styling | [Tailwind CSS](https://tailwindcss.com/) + [PostCSS](https://postcss.org/) / Autoprefixer |
| Icons | [Lucide React](https://lucide.dev/) |
| OpenAI integration | [`openai` npm package](https://www.npmjs.com/package/openai) (Chat Completions, streaming) |
| PDF export | [jsPDF](https://github.com/parallax/jsPDF) |
| Linting | [ESLint](https://eslint.org/) with TypeScript and React plugins |

**Note:** The project `package.json` also lists `html2canvas` and `react-speech-recognition`, but **they are not imported or used** in the current `src` code. They may be reserved for future features or left over from experiments.

---

## Architecture overview

- **`App.tsx`** — Layout: sidebar, main chat area, settings modal; pulls state and actions from `useChat`.
- **`useChat` hook** — Single source of truth for conversations, UI preferences, API key, and persistence to `localStorage` under the key `lexica-ai-state`.
- **`openai.ts`** — Wraps the OpenAI client, initializes with the user’s API key, exposes `streamChatCompletion` (async generator of text chunks). Also defines `translateMessage`, which is **not used** elsewhere in the app today.
- **Components** — Presentational pieces: `Sidebar`, `ConversationList`, `ChatArea`, `Message`, `MessageInput`, `SettingsModal`.
- **Utilities** — `languages.ts` (locale list and names), `pdfExport.ts` (PDF generation), `mockResponses.ts` (mock helpers **not wired** into the live chat flow).

Data flow for a message: user submits text → `sendMessage` appends user message → builds OpenAI `messages` array (plus optional system message for language) → streams assistant content into state → marks streaming complete.

---

## Prerequisites

- **Node.js** — Use a current LTS version (for example 18.x or 20.x).
- **npm** — Comes with Node (this repo uses `package-lock.json`).
- An **OpenAI API key** with access to the models you select ([OpenAI Platform](https://platform.openai.com/)).

---

## Installation

From the project root:

```bash
npm install
```

This installs all dependencies listed in `package.json`.

---

## Running the app

**Development server** (hot reload):

```bash
npm run dev
```

By default, Vite is configured to listen on **all interfaces** at port **5173** (`host: "0.0.0.0"`, `port: 5173` in `vite.config.ts`). You can open:

- `http://localhost:5173`
- Or from another device on the same network: `http://<your-machine-ip>:5173`

---

## Configuration

All product configuration is done **inside the app** (no `.env` file is required by this codebase):

1. Open **Settings** from the sidebar.
2. Paste your **OpenAI API key**.
3. Choose **model** and **response language**.
4. Click **Save Settings**.

The key is saved in browser storage with the rest of the app state. After saving, the OpenAI client is re-initialized with that key.

---

## Building for production

```bash
npm run build
```

Output is written to `dist/`. Serve that folder with any static host (NGINX, Netlify, Vercel, S3, etc.).

**Preview the production build locally:**

```bash
npm run preview
```

---

## Data storage and privacy

- **Where data lives:** Almost everything is stored under **`localStorage`** as JSON (`lexica-ai-state`), including conversations, messages, theme, language, model, and API key.
- **What leaves your machine:** Requests go to **OpenAI’s API** with your key and conversation text. This project does not define a separate “Lexica server” that stores your chats.
- **Export:** PDFs are generated **in the browser** and downloaded; nothing is uploaded for export.

---

## Security notes

1. **API key in the browser** — Storing a production API key in client-side JavaScript and `localStorage` is convenient for a personal or demo app but **increases exposure** (XSS, shared machines, browser extensions). For production systems, a **backend proxy** that holds the key server-side is usually recommended.
2. **`dangerouslyAllowBrowser: true`** — The OpenAI SDK is explicitly allowed to run in the browser in `src/utils/openai.ts`. That matches the current design but is worth understanding before deploying publicly.
3. **HTTPS** — Use HTTPS when hosting so traffic and storage policies match typical security expectations.

---

## Scripts reference

| Script | Command | Purpose |
|--------|---------|---------|
| Development | `npm run dev` | Start Vite dev server |
| Production build | `npm run build` | Type-check and bundle to `dist/` |
| Preview | `npm run preview` | Serve the production build locally |
| Lint | `npm run lint` | Run ESLint on the project |

---

## Project structure

```
├── index.html              # HTML shell and root mount
├── vite.config.ts          # Vite + React plugin, dev server host/port
├── package.json
├── tailwind.config.js
├── postcss.config.js
├── eslint.config.js
├── tsconfig*.json
└── src/
    ├── main.tsx            # React entry
    ├── App.tsx             # Root layout
    ├── index.css           # Global styles (Tailwind layers)
    ├── vite-env.d.ts
    ├── components/         # UI components
    ├── hooks/
    │   └── useChat.ts      # State, persistence, send/stream logic
    ├── types/
    │   └── chat.ts         # Message, Conversation, ChatState types
    └── utils/
        ├── openai.ts       # OpenAI client + streaming
        ├── languages.ts
        ├── pdfExport.ts
        └── mockResponses.ts
```

---

## Limitations and known behaviors

1. **Attachments** — The UI lets you select files and images and shows them on the user bubble, but **only text** is passed to `chat.completions.create`. Multimodal / file-upload APIs are not implemented here.
2. **Text-only sends** — If you attach files **without** any text, the app adds your message to the thread but **does not** call the API (the implementation returns early when there is no text).
3. **Unused code / packages** — `mockResponses.ts`, `translateMessage` in `openai.ts`, and the `html2canvas` / `react-speech-recognition` dependencies are **not part of the active chat path** in the current source.
4. **PDF labels** — The PDF export labels the assistant as **“ChatGPT”** in the header line (wording in `pdfExport.ts`), while the UI brand is Lexica.
5. **Streaming parameters** — Requests use `temperature: 0.7` and `max_tokens: 2000` as fixed values in `openai.ts` (not exposed in Settings).

---

## Troubleshooting

| Issue | What to check |
|-------|----------------|
| “Please set your OpenAI API key” | Open **Settings**, paste a valid key, save. |
| Invalid API key error | Regenerate or copy the key from the OpenAI dashboard; ensure no extra spaces. |
| Rate limit | Wait and retry, or check usage limits on your OpenAI account. |
| Empty or stuck reply | Network issues or API errors — browser devtools **Console** and **Network** tabs; confirm the model name is available to your account. |
| State feels wrong after edits | Clear site data for the origin or remove `localStorage` key `lexica-ai-state` (this wipes conversations and settings). |

---

## License

No license file is included in this repository. If you plan to distribute or reuse the code, add a `LICENSE` file with terms you are comfortable with.

---

*Lexica AI — a React + Vite chat client for OpenAI.*
