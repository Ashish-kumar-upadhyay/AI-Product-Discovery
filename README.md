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
```bash
cd backend
npm install
```

### Environment setup
```bash
# Copy the example environment file
cp .env.example .env

# Edit .env and add your OpenAI API key
# OPENAI_API_KEY=your_actual_openai_api_key_here
```

### Start backend
```bash
npm start
```
Backend will run on http://localhost:5000

---

## 🚀 2. Frontend Setup

### Install dependencies
```bash
cd frontend
npm install
```

### Environment setup (optional)
```bash
# Create .env.local if you want to override API base URL
echo "NEXT_PUBLIC_API_BASE_URL=http://localhost:5000" > .env.local
```

### Start frontend
```bash
npm run dev
```
Frontend will run on http://localhost:3000

---

## 🌐 3. Deployment Links

- **Backend**: https://ai-product-discovery-gray.vercel.app
- **Frontend**: https://frontend-ashish11.vercel.app

---

## 🧪 4. Testing the Application

1. **Browse Products**: Open the frontend and see all 8 products
2. **AI Search**: Try queries like:
   - "budget laptops for students"
   - "gaming laptops"
   - "monitors for design work"
   - "what's good for office work?"

---

## ⏱️ Time Spent

~3 hours (including deployment)

---

## 📝 What's Implemented

### Backend
- ✅ Express server with CORS
- ✅ GET /api/products - List/filter products
- ✅ POST /api/ask - AI-powered natural language search
- ✅ OpenAI integration with structured JSON response
- ✅ Error handling for missing API keys and LLM failures

### Frontend
- ✅ Next.js App Router setup
- ✅ Product listing with category and search
- ✅ AI ask interface with loading states
- ✅ Reusable ProductCard component
- ✅ Responsive design with CSS modules
- ✅ Error handling and user feedback

### AI/LLM Features
- ✅ Natural language query understanding
- ✅ Product matching based on context
- ✅ Structured response (productIds + summary)
- ✅ Graceful error handling

---

## 🎯 Assessment Ready

This submission meets all requirements for the Full-Stack Developer (1–3 years) assessment:
- ✅ Backend API with LLM integration
- ✅ Frontend with React fundamentals
- ✅ End-to-end working application
- ✅ Proper security practices
- ✅ Clean, maintainable code
