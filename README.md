<div align="center">

# 🚀 Lexica AI

**A sleek, browser-based AI chat — React, TypeScript & OpenAI.**

*Multi-turn conversations • Pick your model • Your history stays on your device*

<br/>

![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-6-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind-3-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)

</div>

---

Lexica is a **single-page app** that talks **directly** to the [OpenAI Chat Completions API](https://platform.openai.com/docs/guides/text-generation). Stream replies, switch models, set a **preferred response language**, and keep everything in **local storage** — no custom backend in this repo.

The UI works beautifully on **desktop & mobile**, with **light** 🌞 and **dark** 🌙 themes.

---

## 📚 Table of Contents

| | Section |
|---|---------|
| ✨ | [What This Project Does](#what-this-project-does) |
| ⚡ | [Features](#features) |
| 🛠️ | [Technology Stack](#technology-stack) |
| 🏗️ | [Architecture Overview](#architecture-overview) |
| 🔧 | [Prerequisites](#prerequisites) |
| 💻 | [Installation](#installation) |
| ▶️ | [Running the App](#running-the-app) |
| ⚙️ | [Configuration](#configuration) |
| 🏭 | [Building for Production](#building-for-production) |
| 🗄️ | [Data Storage & Privacy](#data-storage--privacy) |
| 🛡️ | [Security Notes](#security-notes) |
| 📜 | [Scripts Reference](#scripts-reference) |
| 📂 | [Project Structure](#project-structure) |
| ⚠️ | [Limitations & Known Behaviors](#limitations--known-behaviors) |
| 🔍 | [Troubleshooting](#troubleshooting) |
| 📝 | [License](#license) |

---

## ✨ What This Project Does

Lexica runs **entirely in your browser** as a SPA. You paste your **OpenAI API key** in Settings, and the app:

| | |
|---:|---|
| 📝 | **Streams** assistant replies **token by token** |
| 💬 | Keeps **multi-turn** context in each conversation |
| 💾 | Saves conversations, messages, theme, language, model & API key in **`localStorage`** |

There is **no custom backend** — the browser uses the official **`openai`** SDK to call OpenAI’s API.

---

## ⚡ Features

### 💬 Chat & AI

| Feature | Description |
|---------|-------------|
| **Streaming replies** | Watch the assistant appear in real time |
| **Multi-turn context** | Each reply uses prior messages in the thread |
| **Model selection** | `gpt-4o-mini` *(default)*, `gpt-4o`, `gpt-4-turbo`, `gpt-3.5-turbo` |
| **Response language** 🌐 | Pick a language; a **system prompt** steers replies *(see `src/utils/languages.ts`)* |
| **Error handling** | Clear messages for invalid keys, rate limits, server errors |

### 🗂️ Conversations

- **Multiple chats** — Create, switch, delete
- **Auto titles** — First user message seeds the title (first few words)
- **Search** — Filter by **title** or **message text**
- **Reset chat** — Clears messages in the **current** chat only *(conversation stays)*

### 🖥️ User Interface

- **Themes** — Light 🌞 / Dark 🌙
- **Welcome screen** — Hero, feature cards, **starter prompts** (one tap to send)
- **Code blocks** — Fenced `` ``` `` blocks with **syntax label** + **copy** per block
- **Copy reply** — Copy full assistant message (hover action)
- **Responsive** — Sidebar becomes a **drawer** on small screens

### ✍️ Input

- **Multiline** — **Enter** sends · **Shift+Enter** newline
- **Attachments** — Preview images & file links in the bubble · **Only text** is sent to the API *(see limitations)*

### 📄 Export

- **PDF** — Current conversation → `.pdf` via **jsPDF** (title, date, roles, timestamps)

### ⚙️ Settings

API key *(show/hide)*, **model**, **language**, and **theme** — all persisted locally.

---

## 🛠️ Technology Stack

| Area | Technology |
|------|------------|
| **UI** | React 18 |
| **Language** | TypeScript |
| **Build** | Vite |
| **Styling** | Tailwind CSS · PostCSS · Autoprefixer |
| **Icons** | Lucide React |
| **OpenAI** | `openai` npm package (streaming chat completions) |
| **PDF** | jsPDF |
| **Lint** | ESLint + TypeScript + React plugins |

> **Note:** `html2canvas` and `react-speech-recognition` are in `package.json` but **not used** in `src` today — handy for future features.

---

## 🏗️ Architecture Overview

```
┌─────────────┐     ┌──────────────┐     ┌─────────────────┐
│   App.tsx   │────▶│  useChat.ts  │────▶│  localStorage   │
│  layout UI  │     │ state + API  │     │ lexica-ai-state │
└─────────────┘     └──────┬───────┘     └─────────────────┘
                           │
                    ┌──────▼───────┐
                    │  openai.ts   │
                    │ stream + SDK │
                    └──────────────┘
```

| Piece | Role |
|-------|------|
| **`App.tsx`** | Shell: sidebar, chat area, settings modal |
| **`useChat`** | Single source of truth · persist `lexica-ai-state` |
| **`openai.ts`** | Client init · **`streamChatCompletion`** (async generator) |
| **Components** | `Sidebar`, `ConversationList`, `ChatArea`, `Message`, `MessageInput`, `SettingsModal` |
| **Utils** | Languages, PDF export, `mockResponses` *(unused in live flow)* |

**Data flow:** User submits → `sendMessage` → build messages (+ optional system prompt for language) → stream chunks → update React state.

---

## 🔧 Prerequisites

- **Node.js** — 18.x or 20.x LTS recommended  
- **npm** — ships with Node  
- **OpenAI API key** — with access to your chosen models  

---

## 💻 Installation

```bash
npm install
```

---

## ▶️ Running the App

**Development** (HMR):

```bash
npm run dev
```

| | |
|---:|---|
| **Port** | `5173` *(see `vite.config.ts`)* |
| **Local** | [http://localhost:5173](http://localhost:5173) |
| **LAN** | `http://<your-machine-ip>:5173` *(host is `0.0.0.0`)* |

---

## ⚙️ Configuration

1. Open **Settings** from the sidebar  
2. Paste your **OpenAI API key**  
3. Choose **model** & **response language**  
4. **Save Settings**  

Everything is stored in **`localStorage`** — no `.env` required by this codebase.

---

## 🏭 Building for Production

```bash
npm run build
```

Output: **`dist/`** — deploy to Netlify, Vercel, NGINX, S3, etc.

**Preview the build locally:**

```bash
npm run preview
```

---

## 🗄️ Data Storage & Privacy

| Stored locally | Sent to OpenAI |
|----------------|----------------|
| Conversations, messages, theme, language, model, API key | Your **chat text** for completions |
| — | — |

- **PDF export** runs **entirely in the browser** — download only, no upload.  
- There is **no Lexica server** in this repo collecting your chats.

---

## 🛡️ Security Notes

| Topic | Why it matters |
|-------|----------------|
| **API key in browser** | Stored in `localStorage` — risk if the page is compromised (XSS, shared device, extensions) |
| **`dangerouslyAllowBrowser: true`** | Required for the official SDK in the browser — **by design** for this client-only app |
| **HTTPS** | Use when hosting so traffic matches normal security expectations |

For production products, a **backend proxy** that holds the key server-side is often preferred.

---

## 📜 Scripts Reference

| Script | Command | Purpose |
|--------|---------|---------|
| Development | `npm run dev` | Vite dev server + HMR |
| Build | `npm run build` | Type-check & bundle → `dist/` |
| Preview | `npm run preview` | Serve production build locally |
| Lint | `npm run lint` | ESLint |

---

## 📂 Project Structure

```
Lexica AI Chatbot/
├── index.html
├── vite.config.ts
├── tailwind.config.js
├── postcss.config.js
├── eslint.config.js
├── package.json
└── src/
    ├── main.tsx
    ├── App.tsx
    ├── index.css
    ├── vite-env.d.ts
    ├── components/
    │   ├── Sidebar.tsx
    │   ├── ConversationList.tsx
    │   ├── ChatArea.tsx
    │   ├── Message.tsx
    │   ├── MessageInput.tsx
    │   └── SettingsModal.tsx
    ├── hooks/
    │   └── useChat.ts
    ├── types/
    │   └── chat.ts
    └── utils/
        ├── openai.ts
        ├── languages.ts
        ├── pdfExport.ts
        └── mockResponses.ts
```

---

## ⚠️ Limitations & Known Behaviors

| # | Limitation |
|---|-------------|
| 1 | **Attachments** — Shown in the UI only; **file contents are not** sent to the Chat Completions API. |
| 2 | **Text-only API path** — If you attach files **without** text, the UI updates but **no** completion is requested. |
| 3 | **Unused** — `mockResponses.ts`, `translateMessage()` in `openai.ts`, `html2canvas`, `react-speech-recognition`. |
| 4 | **PDF label** — Assistant line reads **“ChatGPT”** in the PDF *(wording in `pdfExport.ts`)*. |
| 5 | **Fixed generation** — `temperature: 0.7`, `max_tokens: 2000` in `openai.ts` — not exposed in Settings. |

---

## 🔍 Troubleshooting

| Issue | Try this |
|-------|----------|
| “Please set your OpenAI API key” | **Settings** → paste key → **Save** |
| Invalid API key | Regenerate on [OpenAI](https://platform.openai.com/api-keys), no extra spaces |
| Rate limit | Wait, retry, check quota / billing |
| Empty or stuck reply | DevTools **Console** / **Network**; confirm model access |
| Weird persisted state | Clear site data or remove `localStorage` key **`lexica-ai-state`** |

---

## 📝 License

No license file is included. Add a **`LICENSE`** if you distribute or open-source the project.

---

<div align="center">

**Lexica AI** — *Your React + Vite chat client for OpenAI.* 💡

<br/>

<sub>Built with care · Type-safe · Stream-first</sub>

</div>
