🚀 Lexica AI

Lexica is a sleek browser-based AI chat application built with React and TypeScript. It connects directly to the OpenAI Chat Completions API, letting you have multi-turn conversations, pick models, set a preferred response language, and keep your chat history locally on your device.

The interface is designed for desktop & mobile, with both light 🌞 and dark 🌙 themes.

📚 Table of Contents
✨ What This Project Does
⚡ Features
🛠️ Technology Stack
🏗️ Architecture Overview
🔧 Prerequisites
💻 Installation
▶️ Running the App
⚙️ Configuration
🏭 Building for Production
🗄️ Data Storage & Privacy
🛡️ Security Notes
📜 Scripts Reference
📂 Project Structure
⚠️ Limitations & Known Behaviors
🛠️ Troubleshooting
✨ What This Project Does

Lexica runs entirely as a single-page application (SPA) in your browser. You simply paste your OpenAI API key in Settings, and the app:

Streams assistant replies token by token 📝
Supports multi-turn conversations
Saves conversations, messages, theme, language, model, and API key locally in localStorage 💾

There’s no custom backend — the browser communicates directly with OpenAI via the official openai SDK.

⚡ Features
💬 Chat & AI
Streaming replies — Watch the AI type in real time.
Multi-turn context — Conversations remember previous messages.
Model selection — gpt-4o-mini (default), gpt-4o, gpt-4-turbo, gpt-3.5-turbo.
Response language — Choose any language 🌐; system instructions ensure AI replies accordingly.
Error handling — Friendly messages for invalid keys, rate limits, or server issues.
🗂️ Conversations
Multiple chats — Create, switch, delete conversations.
Auto-generated titles — First user message becomes the conversation title.
Search — Filter by title or message content.
Reset chat — Clears the current conversation only.
🖥️ User Interface
Light 🌞 / Dark 🌙 themes
Welcome screen — Hero section, feature cards, and starter prompts.
Code support — Fenced code blocks with copy buttons.
Copy messages — Hover and copy assistant replies.
Responsive layout — Sidebar becomes drawer on mobile.
✍️ Input
Multiline input — Enter sends, Shift+Enter adds a newline.
Attachments — Preview images and links (text-only sent to API).
📄 Export
PDF export — Download entire conversation with timestamps and roles using jsPDF.
⚙️ Settings
Store OpenAI API key, model, language, and theme locally.
🛠️ Technology Stack
Area	Technology
UI	React 18
Language	TypeScript
Build	Vite
Styling	Tailwind CSS + PostCSS
Icons	Lucide React
OpenAI integration	openai npm package
PDF export	jsPDF
Linting	ESLint with TypeScript & React plugins

Note: html2canvas & react-speech-recognition exist but are unused — possible future features.

🏗️ Architecture Overview
App.tsx — Layout, sidebar, chat area, settings modal.
useChat hook — Single source of truth for state & persistence (localStorage key: lexica-ai-state).
openai.ts — OpenAI client wrapper; streams chat completion.
Components — Sidebar, ConversationList, ChatArea, Message, MessageInput, SettingsModal.
Utilities — Language list, PDF export, mock responses (unused).

Data flow: User → sendMessage → API call → stream assistant → update state.

🔧 Prerequisites
Node.js (18.x or 20.x LTS)
npm (comes with Node)
OpenAI API key with access to your chosen models
💻 Installation
npm install
▶️ Running the App

Development server (hot reload):

npm run dev
Default port: 5173
Access locally: http://localhost:5173
Access on network: http://<your-machine-ip>:5173
⚙️ Configuration
Open Settings.
Paste your OpenAI API key.
Choose model & response language.
Click Save Settings.

Everything is stored locally in localStorage.

🏭 Building for Production
npm run build

Serve dist/ via Netlify, Vercel, NGINX, S3, etc.

Preview locally:

npm run preview
🗄️ Data Storage & Privacy
Stored locally: conversations, messages, theme, language, model, API key.
Sent to OpenAI: only your chat messages.
PDF export: fully local, downloaded to your device.
🛡️ Security Notes
API key stored in browser → exposed to XSS & extensions.
dangerouslyAllowBrowser: true → OpenAI runs client-side by design.
Use HTTPS when hosting for secure traffic.
📜 Scripts Reference
Script	Command	Purpose
Development	npm run dev	Start dev server
Production build	npm run build	Type-check & bundle
Preview	npm run preview	Serve production locally
Lint	npm run lint	Run ESLint
📂 Project Structure
src/
├─ main.tsx
├─ App.tsx
├─ index.css
├─ components/
├─ hooks/useChat.ts
├─ types/chat.ts
└─ utils/
   ├─ openai.ts
   ├─ languages.ts
   ├─ pdfExport.ts
   └─ mockResponses.ts
⚠️ Limitations & Known Behaviors
Attachments: UI preview only; text is sent to API.
Text-only sends: Messages without text won’t call API.
Unused code: mockResponses.ts, translateMessage, html2canvas, react-speech-recognition.
PDF labels: Assistant labeled as ChatGPT.
Streaming params: temperature: 0.7, max_tokens: 2000 (fixed).
🛠️ Troubleshooting
Issue	Solution
“Please set your OpenAI API key”	Open Settings, paste a valid key.
Invalid API key	Regenerate on OpenAI dashboard.
Rate limit	Wait & retry; check OpenAI usage.
Empty/stuck reply	Check network, API, devtools Console/Network.
State feels wrong	Clear lexica-ai-state from localStorage.
📝 License

No license included. Add your preferred LICENSE if distributing.

Lexica AI — Your React + Vite chat client for OpenAI. 💡
