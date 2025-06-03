# NewsBreeze - Product Requirements Document (PRD)

## ✨ Overview

**NewsBreeze** is a minimalist news aggregation app that:

- ✅ Fetches the latest news headlines via APIs (NewsAPI).
- ✅ Summarizes each headline using a Hugging Face model (`falconsai/text_summarization`).
- ✅ Allows users to play summaries using text-to-speech (Hugging Face TTS models).

## ⏱️ Constraints

- ✅ MVP scope; build only core features.
- ✅ Must be completed in **1 hour**.
- **Stack**:

  - ✅ **Backend**: Node.js (no TypeScript)
  - ✅ **Frontend**: React (simple, clean UI)

- Submission must be a **public GitHub repo**.
- ✅ Must be deployable/testable locally.

## ✅ Functional Requirements

### 1. Fetch News Headlines ✅

- ✅ Use NewsAPI: https://newsapi.org/docs/endpoints/top-headlines
- ✅ Parse on server-side in Node.js.
- ✅ Fetch and return **top 5** headlines.

### 2. Summarize Headlines ✅

- ✅ Use Hugging Face model `falconsai/text_summarization`.
- ✅ Send full headline and/or linked content to API.
- ✅ Return 1–2 sentence summary.

### 3. Read Summary in Voice ✅

- ✅ Use Hugging Face TTS model (alternative to `coqui/xtts-v2`).
- ✅ Server-side synthesis of audio for summary text.
- ✅ Return audio buffer for playback.

### 4. Frontend UI ✅

- ✅ Display headline, summary, and play button.
- ✅ Clean, minimal, responsive layout.
- ✅ Basic loading indicators for data/audio fetch.

## 🛠️ Technical Implementation

### Backend (Node.js + Express) ✅

#### Endpoints ✅

- ✅ **GET /api/news**

  - ✅ Fetch from NewsAPI
  - ✅ Summarize each article
  - ✅ Return JSON with headline + summary

- ✅ **POST /api/audio**
  - ✅ Input: summary text
  - ✅ Output: audio file buffer

#### Environment Variables ✅

- ✅ `NEWS_API_KEY`
- ✅ `HUGGINGFACE_API_KEY`
- ✅ `PORT`

### Frontend (React) ✅

- ✅ Fetch `/api/news` on load
- ✅ Display list: Headline + Summary + Play button
- ✅ Fetch `/api/audio` on click
- ✅ Play audio using `<audio>` tag

## 📁 Folder Structure ✅

```
NewsBreeze/ ✅
├── backend/ ✅
│   ├── index.js ✅
│   ├── src/
│   │   └── routes/
│   │       ├── news.js ✅
│   │       └── audio.js ✅
│   ├── env.example ✅
│   ├── .env ✅
│   └── package.json ✅
├── frontend/ ✅
│   ├── src/
│   │   ├── App.tsx ✅
│   │   └── App.css ✅
│   └── package.json ✅
├── README.md ✅
└── .gitignore ✅
```

## 📄 README Requirements ✅

- ✅ Project overview
- ✅ Tech stack
- ✅ Setup instructions:

  - ✅ Clone
  - ✅ Install dependencies (backend + frontend)
  - ✅ Add `.env` with API keys
  - ✅ Run both backend & frontend

- ✅ APIs/models used:
  - ✅ NewsAPI: Top headlines
  - ✅ Summary: `falconsai/text_summarization`
  - ✅ Voice: Hugging Face TTS models

## 🧪 Manual Test Checklist

- [x] Headlines display in UI
- [x] Summaries are shown
- [x] Play button works and plays audio
- [x] App stable on refresh
- [x] Responsive, clean UI

## 🏁 Delivery Checklist

### Phase 1 ✅ COMPLETED

- [x] Backend implementation
- [x] API endpoints created
- [x] Environment configuration
- [x] Dependencies installed

### Phase 2 ✅ COMPLETED

- [x] Frontend React app
- [x] Modern UI design
- [x] Responsive layout
- [x] Audio playback functionality

### Final Deliverables ✅ COMPLETED

- [x] README with setup steps
- [x] MVP features working
- [x] React frontend with TypeScript
- [x] Backend with Node.js
- [x] Audio + summaries working
- [x] Environment configuration example
- [x] Clean, minimalist design

## 🎉 PROJECT STATUS: COMPLETED ✅

All core features have been implemented according to the PRD requirements. The application is ready for testing and deployment.
