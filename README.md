# GitaGPT ॐ — Timeless Wisdom of the Bhagavad Gita

An AI chatbot application crafted with **React**, **TypeScript**, and **Tailwind CSS**. GitaGPT offers guidance, philosophical insights, and life clarity derived from the teachings and verses of the Bhagavad Gita, presented in an interface reminiscent of modern conversational AI (ChatGPT & Gemini) with a calm, serene, and spiritual atmosphere.

---

## ✨ Features

- **Spiritual & Calm UI Design**:
  - Sandalwood gold and warm saffron accents with sacred lotus and ॐ iconography.
  - Dual Spiritual Themes: **Dhyana Twilight** (dark mode) & **Sandalwood Dawn** (warm parchment light mode).
  - Ambient glowing gradients, serene typography with *Cinzel* and *Plus Jakarta Sans*.
  - Soothing Tibetan singing bowl / meditation chime synthesized via the Web Audio API on response completion (with mute toggle).

- **Real-time Streaming Responses**:
  - Direct consumption of Server-Sent Events (SSE) stream (`data: {"type": "chunk", "content": "..."}`).
  - Live typewriter animation with animated pulsing indicator.
  - Ability to stop generation midway with the Stop button.

- **Session Context Continuity**:
  - Automatically captures `response_id` emitted at the end of each stream (`response_id: resp_...`).
  - Passes it as `previous_response_id` in subsequent requests within the same session.
  - Starting a **New Chat** automatically resets `previous_response_id` to `null`.
  - Transparent Context Tracker visible in header and settings modal.

- **Rich Philosophical & Practical Wisdom**:
  - **18 Chapters of the Bhagavad Gita**: Dedicated interactive chapter explorer covering all 18 chapters and 700 verses, with one-click inquiry buttons.
  - **Daily Shloka**: Rotating verses with original Sanskrit, English transliteration, word meaning, and practical reflection.
  - **Curated Prompt Suggestions**: Guidance on dealing with loneliness, overthinking, career duties, letting go of outcomes, relationship equanimity, and mind control.

- **Conversational Utilities**:
  - Markdown formatting with highlighted Chapter/Verse citations and blockquotes styled like sacred palm leaf scripts.
  - Copy to clipboard with instant feedback.
  - **Listen / Text-to-Speech (TTS)**: Built-in reader using Web Speech API with meditative pacing.
  - Session history saved in `localStorage`: rename, switch, or delete previous conversations.
  - Connection & API endpoint configuration modal.

---

## 🛠️ API Specification

### Endpoint
- Default: `http://127.0.0.1:8000/chat`
- Fallback / Proxy: `/api-chat` (seamlessly configured in `vite.config.ts` to prevent browser CORS blockages)

### Request Payload
```json
{
  "message": "How to deal with loneliness?",
  "previous_response_id": null
}
```
*Note: For follow-up questions in the same conversation, `previous_response_id` is automatically set to the stored `response_id`.*

### Streaming Response Format
```text
data: {"type": "chunk", "content": "De"}
data: {"type": "chunk", "content": "aling"}
...
response_id: resp_067cd2be5fc01a02006abc9fddbc9c87d09cc5b6d9e46a21c2
```

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js** (v20+)
- **npm** (v10+)
- The GitaGPT backend service running at `http://127.0.0.1:8000/chat`

### 2. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 3. Build for Production
```bash
npm run build
```
Preview the production build:
```bash
npm run preview
```
