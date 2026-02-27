# ⚡ AI Product Discovery – Full‑Stack Demo

Mini product discovery experience with an **LLM‑powered “Ask AI”** assistant.  
Users can browse a product catalog and ask questions in natural language like _“budget laptops for students”_ or _“what’s good for gaming?”_.

---

## 🔧 Tech Stack

- **Backend**: Node.js, Express, OpenAI SDK
- **Frontend**: Next.js (App Router), React
- **AI / LLM**: OpenAI Chat Completions (model configurable via env)

---

## 🗂 Project Structure

- `backend/`
  - `src/server.js` – Express server, `/api/products` + `/api/ask`
  - `src/products.js` – In‑memory product catalog (8 products)
  - `.env.example` – sample env vars
  - `package.json`
- `frontend/`
  - `app/page.js` – main UI (product list + Ask AI box)
  - `app/layout.js` – metadata, root layout
  - `app/page.module.css` – page styling
  - `components/ProductCard.jsx` – reusable product card
  - `components/ProductCard.module.css` – card styling
  - `lib/api.js` – API helper functions
  - `.env.local` – frontend env vars (ignored by git)
  - `package.json`

---

## 🚀 1. Backend Setup

### Install dependencies
