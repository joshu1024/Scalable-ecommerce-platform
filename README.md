# 👟 SneakerZone — Full-Stack E-Commerce App + AI Features

A production-ready full-stack ecommerce platform built with React, Redux Toolkit, Node.js, Express, PostgreSQL, and Prisma. Features JWT authentication, PayPal payments, Cloudinary image uploads, a full Admin Dashboard, and an AI-powered shopping assistant built with Groq and Llama 3.1.

![React](https://img.shields.io/badge/Frontend-React-blue)
![Node](https://img.shields.io/badge/Backend-Node.js-green)
![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL-336791)
![Prisma](https://img.shields.io/badge/ORM-Prisma-2D3748)
![Groq](https://img.shields.io/badge/AI-Groq%20%2F%20Llama%203.1-orange)
![License](https://img.shields.io/github/license/joshu1024/mern-ecommerce)

---

## 🌐 Live Demo

- 🛍️ **Frontend (Vercel)** → [mern-ecommerce-26w1-git-main-joes-projects-50075601.vercel.app](https://mern-ecommerce-26w1-git-main-joes-projects-50075601.vercel.app/)
- ⚙️ **Backend (Render)** → [mern-ecommerce-4ahr.onrender.com](https://mern-ecommerce-4ahr.onrender.com/)

---

## 🚀 Features

### 🛍️ User Features
- 🔐 JWT-based Authentication — Login, Register, Logout
- 🛒 Add to Cart / Remove from Cart / Clear Cart
- 🔍 Product Search, Category & Brand Filtering
- 💳 PayPal Sandbox Payment Integration
- 📦 Order History & Tracking
- 👤 User Profile Management
- 🤖 AI Shopping Assistant — ask questions about products in natural language

### 🧑‍💼 Admin Dashboard
- 📦 **Product Management** — Add, Edit, Delete products with Cloudinary image uploads
- 🤖 **AI Description Generator** — Generate product titles, descriptions, bullet points and SEO tags from product data using Groq/Llama 3.1
- 👥 **User Management** — View all users, toggle roles, delete accounts
- 🧾 **Order Management** — View all orders, update order status
- 📊 **Analytics** — Revenue charts, order trends, stats overview powered by Recharts

---

## 🤖 AI Features (Phase 1 — In Progress)

This project is being progressively upgraded with AI capabilities as part of a fullstack AI engineer learning roadmap.

### ✅ Completed
| Feature | Description | Tech |
|---------|-------------|------|
| AI Chat Endpoint | Natural language shopping assistant with conversation history, assistant role, and few-shot prompting | Groq / Llama 3.1 |
| AI Product Description Generator | Generates title, description, bullet points, and SEO tags from product data. Returns validated JSON. | Groq / Llama 3.1 + Zod |
| Streaming Chat Widget | Word-by-word streaming response in the storefront UI with blinking cursor and stop functionality | Groq / Llama 3.1 + SSE |

### 🔜 Coming Soon
| Feature | Description |
|---------|-------------|
| Natural Language Product Search | AI queries real product database using function calling / tool use |
| Per-user Token Quota | Track AI usage per user per month in Prisma |
| AI Usage Dashboard | Admin panel showing total AI calls, tokens used, and estimated cost |
| Semantic Product Search | pgvector embeddings for "find something warm to wear in the rain" |
| Document Q&A | Upload policy docs, query them in natural language (RAG) |

---

## 🧠 Tech Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| React (Vite) | UI framework |
| Redux Toolkit | Global state management |
| Tailwind CSS | Styling |
| Axios | HTTP requests |
| React Router DOM | Client-side routing |
| Recharts | Admin analytics charts |
| Framer Motion | UI animations |

### Backend
| Technology | Purpose |
|------------|---------|
| Node.js + Express | REST API server |
| PostgreSQL | Relational database |
| Prisma ORM | Database access and migrations |
| JWT + bcryptjs | Authentication and password hashing |
| PayPal REST API | Payment processing |
| Cloudinary + Multer | Image storage and uploads |
| express-rate-limit | Brute force protection |
| Groq SDK | AI inference — Llama 3.1 8B Instant |
| Zod | AI output schema validation |
| Server-sent Events (SSE) | Real-time token streaming from backend to React frontend |

---

## 🔐 Security Features

- **httpOnly cookies** — JWT stored in httpOnly cookie, not localStorage, protecting against XSS
- **Role-based access control** — Separate auth and admin middleware on all protected routes
- **bcrypt password hashing** — Passwords never stored in plain text
- **Rate limiting** — Login and register endpoints limited to 10 requests per 15 minutes
- **CORS protection** — Only whitelisted origins can make requests
- **Environment variables** — All secrets stored in .env, never committed to source control
- **Prisma Role enum** — User roles enforced at database schema level
- **AI route protection** — All AI endpoints sit behind existing auth middleware
- **Input validation** — All AI inputs validated with Zod before reaching the model

---

## 🤖 AI Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/chat/prompt` | Shopping assistant with conversation history and few-shot prompting | Public |
| POST | `/api/chat/stream` | Same assistant with word-by-word SSE streaming — used by the chat widget | Public |
| POST | `/api/chat/generate-description` | Generate structured product description from product fields | Admin only |

### Example — Chat Endpoint

**Request:**
```json
POST /api/chat/prompt
{
  "messages": [
    { "role": "user", "content": "do you have waterproof jackets?" }
  ]
}
```

**Response:**
```json
{
  "reply": "Yes! We carry several waterproof jacket styles. Could you share your budget or preferred brand? That'll help me point you to the best options."
}
```

### Example — Streaming Chat Endpoint

**Request:**
```json
POST /api/chat/stream
{
  "messages": [
    { "role": "user", "content": "do you have Nike shoes?" }
  ]
}
```

**Response (SSE stream):**
```
data:{"token":"Yes"}
data:{"token":","}
data:{"token":" we"}
data:{"token":" carry"}
data:{"token":" Nike"}
data:{"token":" shoes"}
data:[DONE]
```

---

### Example — Product Description Generator

**Request:**
```json
POST /api/chat/generate-description
{
  "name": "Nike Air Max 90",
  "category": "Sneakers",
  "brand": "Nike",
  "oldPrice": 150,
  "newPrice": 120
}
```

**Response:**
```json
{
  "title": "Nike Air Max 90 — Iconic Comfort Sneakers",
  "description": "The Nike Air Max 90 delivers legendary cushioning and timeless style...",
  "bulletPoints": [
    "Visible Air-Sole unit for maximum cushioning",
    "Durable leather and mesh upper",
    "Classic silhouette with modern comfort"
  ],
  "seoTags": ["Nike Air Max 90", "Men's Sneakers", "Comfortable Running Shoes"]
}
```

---

## 📂 Folder Structure

```
mern-ecommerce/
│
├── client/                     # React + Vite frontend
│   ├── src/
│   │   ├── app/                # Redux store setup
│   │   ├── features/           # Redux slices (cart, product, user, order, admin)
│   │   ├── components/         # Reusable UI components (NavBar, Footer, etc.)
│   │   ├── pages/              # Home, Product, Cart, Checkout, Profile, Admin pages
│   │   ├── layout/             # AdminLayout
│   │   ├── middleware/         # ProtectedRoute, AdminRoute
│   │   └── assets/             # Images, data.js
│   ├── public/
│   └── vite.config.js
│
├── server/                     # Express + PostgreSQL backend
│   ├── config/                 # Prisma client, Cloudinary config, env
│   ├── controllers/            # Route controllers (user, product, cart, order, admin, prompt)
│   ├── middleware/             # authMiddleware, adminMiddleware
│   ├── prisma/                 # schema.prisma + migrations
│   ├── routes/                 # Express route definitions
│   ├── utils/                  # generateToken helper
│   └── server.js
│
└── README.md
```

---

## ⚙️ Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/joshu1024/mern-ecommerce.git
cd mern-ecommerce
```

### 2. Install Dependencies
```bash
# Frontend
cd client
npm install

# Backend
cd ../server
npm install
```

### 3. Configure Environment Variables

Create a `.env` file inside the `server/` directory:

```env
DATABASE_URL=your_postgresql_connection_string
JWT_SECRET=your_jwt_secret_key
PORT=4000
NODE_ENV=development
ALLOWED_ORIGINS=http://localhost:5173
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
PAYPAL_CLIENT_ID=your_paypal_client_id
PAYPAL_CLIENT_SECRET=your_paypal_client_secret
GROQ_API_KEY=your_groq_api_key
```

Create a `.env` file inside the `client/` directory:

```env
VITE_API_BASE_URL=http://localhost:4000
VITE_PAYPAL_CLIENT_ID=your_paypal_client_id
```

Get a free Groq API key at [console.groq.com](https://console.groq.com)

### 4. Set Up the Database
```bash
cd server
npx prisma migrate dev --name init
npx prisma generate
```

### 5. Run Development Servers
```bash
# Terminal 1 — Backend
cd server
npm run dev

# Terminal 2 — Frontend
cd client
npm run dev
```

App runs on: **http://localhost:5173**

---

## ☁️ Deployment

### Backend on Render
1. Go to [Render.com](https://render.com) → New Web Service
2. Connect your GitHub repository
3. Set Root Directory → `server`
4. Build Command: `npm install && npx prisma generate`
5. Start Command: `npm start`
6. Add environment variables including `GROQ_API_KEY`

### Frontend on Vercel
1. Go to [Vercel.com](https://vercel.com) → Import GitHub repo
2. Set Root Directory → `client`
3. Add environment variables

### Run Production Database Migrations
```bash
DATABASE_URL="your_render_postgres_url" npx prisma migrate deploy
```

---

## 🗄️ Database Schema

The app uses PostgreSQL with the following relational models:

```
User ──< Order ──< OrderItem >── Product
User ──< Cart  ──< CartItem  >── Product
```

- **User** — stores credentials, role (user/admin)
- **Product** — name, price, brand, category, images, stock
- **Cart / CartItem** — per-user server-side cart
- **Order / OrderItem** — completed orders with status tracking

---

## 🎥 Screenshots

### 🏠 Home Page
<img width="1920" height="1080" alt="Home Page" src="https://github.com/user-attachments/assets/8506c265-1881-4bfb-a729-60d482a90264" />
<img width="1920" height="1080" alt="Home Page 2" src="https://github.com/user-attachments/assets/1c32ca3f-9183-464a-9a16-303497b11d5f" />
<img width="1920" height="1080" alt="Home Page 3" src="https://github.com/user-attachments/assets/c1aa2eaf-994d-444d-acda-08d4713f688e" />
<img width="1920" height="1080" alt="Home Page 4" src="https://github.com/user-attachments/assets/53f44390-0a13-4dce-91cb-f46516cb22c5" />
<img width="1920" height="1080" alt="Home Page 5" src="https://github.com/user-attachments/assets/ba5fb32e-0ffb-4ea2-b897-3d22d9cf94e8" />

### 👟 Product Details
<img width="1920" height="1080" alt="Product Details" src="https://github.com/user-attachments/assets/a60c09a5-7133-483c-8080-84081f1f3473" />
<img width="1920" height="1080" alt="Product Details 2" src="https://github.com/user-attachments/assets/4b778b32-327b-44e2-a031-f5874a68dde4" />
<img width="1920" height="1080" alt="Product Details 3" src="https://github.com/user-attachments/assets/4471e168-2ab3-4d36-bd49-1353694b737e" />

### 🛒 Cart & Checkout
<img width="1920" height="1080" alt="Cart" src="https://github.com/user-attachments/assets/906d7e39-9383-4523-b139-7da10183bae7" />
<img width="1920" height="1080" alt="Checkout" src="https://github.com/user-attachments/assets/3efdc162-5dfb-410b-8c50-3b30a63e04f0" />
<img width="1920" height="1080" alt="PayPal" src="https://github.com/user-attachments/assets/ea11f694-9e96-4e48-8dc5-0fd1de661eba" />
<img width="1920" height="1080" alt="Order Summary" src="https://github.com/user-attachments/assets/33fd0c5c-0d17-4a2f-89eb-d9c636808c4c" />

### 🔐 Authentication
<img width="1920" height="1080" alt="Login" src="https://github.com/user-attachments/assets/62a3d7b7-7f30-4cbc-af02-d1978ccd48fb" />
<img width="1920" height="1080" alt="Register" src="https://github.com/user-attachments/assets/b8bca4bc-a492-4ab7-bab2-fac4d07066b4" />

### 🧑‍💼 Admin Dashboard
<img width="1920" height="1080" alt="Admin Dashboard" src="https://github.com/user-attachments/assets/548b0d88-f0d9-460b-9057-887732f676f1" />
<img width="1920" height="1080" alt="Admin Products" src="https://github.com/user-attachments/assets/1c4f7a0d-9819-41d0-a36e-6b9cbe85588d" />
<img width="1920" height="1080" alt="Admin Orders" src="https://github.com/user-attachments/assets/acb743fe-c965-4a97-88ff-9c8cf1d5665f" />
<img width="1920" height="1080" alt="Admin Users" src="https://github.com/user-attachments/assets/d909b01d-d55b-42d4-8b02-e2564561efbe" />
<img width="1920" height="1080" alt="Admin Analytics" src="https://github.com/user-attachments/assets/6fbea047-5cce-4cf2-b14b-d01eac94e56e" />

---

## 🧑‍💼 Demo Admin Login

Use the following credentials to explore the Admin Dashboard:

| Field | Value |
|-------|-------|
| Email | iamAdmin@gmail.com |
| Password | 123456 |

> ⚠️ Demo-only account for portfolio showcase. Do not use these credentials in production environments.

---

## 🗺️ AI Roadmap

This project is being progressively upgraded as part of a fullstack AI engineer learning roadmap:

- ✅ **Phase 1** — AI integration fundamentals (Groq API, prompt engineering, streaming, function calling)
- 🔜 **Phase 2** — RAG & embeddings (pgvector semantic search, document Q&A)
- 🔜 **Phase 3** — Agents (autonomous shopping agent with LangGraph/Mastra)
- 🔜 **Phase 4** — Production AI (LangSmith tracing, evals, cost optimisation)

---

## 🧑‍💻 Author

**Joshua Kipamet Olting'idi**

- 💼 [LinkedIn](https://linkedin.com)
- 🐦 [Twitter @JoeKipamet71036](https://twitter.com/JoeKipamet71036)
- 💻 [GitHub @joshu1024](https://github.com/joshu1024)

---

## ⭐ Acknowledgements

- Redux Toolkit Team
- Prisma ORM Team
- PayPal Developer Docs
- Cloudinary
- Vite + React Ecosystem
- Render & Vercel
- Groq — free LLM inference API
- Meta — Llama 3.1 open source model

---

💡 If you found this project helpful, please give it a ⭐ on GitHub!
