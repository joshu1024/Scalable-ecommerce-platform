🛒 MERN E-Commerce App with Admin Dashboard

Production-ready MERN e-commerce platform with JWT authentication, PayPal payments, admin product management, and scalable Redux Toolkit state architecture.

This project delivers a complete online shopping experience — including secure authentication, product management, cart and checkout flow, PayPal payment integration, and an advanced Admin Dashboard for managing users, orders, and products in real-time.

🚀 Features
🛍️ User Features

🔐 JWT-based Authentication (Login, Register, Logout)

🛒 Add to Cart / Remove from Cart

🛍️ Product Filtering, Sorting & Search

💳 PayPal Payment Integration

📦 Order Tracking

👤 Profile Management

🧑‍💼 Admin Dashboard

Manage your e-commerce system efficiently with real-time control:

📦 Product Management

Add, Edit, and Delete products

Manage stock and product images

👥 User Management

View all registered users

Change user roles (Admin / Customer)

Delete users

🧾 Order Management

View all orders

Update order status

📊 Analytics Dashboard

Interactive charts and graphs for orders, revenue, and users (powered by MongoDB data)

🧠 Tech Stack

Frontend

⚛️ React (Vite)

🧠 Redux Toolkit (State Management)

🎨 Tailwind CSS

🔌 Axios

🔐 React Router DOM

📈 Recharts (Admin analytics)

Backend

🟢 Node.js + Express.js

🍃 MongoDB + Mongoose

🔒 JWT Authentication + bcryptjs

💵 PayPal REST API Integration

☁️ Multer (for image uploads)

⚙️ Installation & Setup
1️⃣ Clone the Repository
git clone https://github.com/joshu1024/mern-ecommerce.git
cd mern-ecommerce

2️⃣ Install Dependencies

# Frontend

cd client
npm install

# Backend

cd ../server
npm install

3️⃣ Configure Environment Variables

Create a .env file inside the server/ directory:

MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
PAYPAL_CLIENT_ID=your_paypal_client_id
PORT=5000

4️⃣ Run Development Servers

# Terminal 1 - Backend

cd server
npm run dev

# Terminal 2 - Frontend

cd client
npm run dev

App runs on: http://localhost:5173

☁️ Deployment Guide
🚀 Deploy Backend on Render

Go to Render.com

Click “New +” → “Web Service”

Connect your GitHub repository

Set Root Directory → server

Build Command:

npm install

Start Command:

npm start

Add environment variables from .env

Deploy 🎉
Render URL example:

https://mern-ecommerce-server.onrender.com

🌐 Deploy Frontend on 🅰️ Vercel

Go to Vercel

Import GitHub repo

Root directory → client

Add environment variable:

VITE_API_BASE_URL=https://mern-ecommerce-server.onrender.com

Deploy 🎉
Example:
mern-ecommerce-26w1.vercel.app

📂 Folder Structure
mern-ecommerce/
│
├── client/ # React + Vite frontend
│ ├── src/
│ │ ├── app/ # Redux store setup
│ │ ├── features/ # Redux slices (cart, product, user, etc.)
│ │ ├── components/ # Reusable UI components
│ │ ├── pages/ # Home, Product, Cart, Checkout, Admin pages
│ │ └── assets/ # Images, data.js
| | |\_\_ layout/ # AdminLayout
| | ├── assets/ # images/ ,data.js  
│ ├── public/
│ └── vite.config.js
│
├── server/ # Postgresql/Prsma
│ ├── config/ # Database connection
│ ├── controllers/ # Route controllers
│ ├── middleware/ # Auth & error handlers
│ ├── models/ # Prisma schemas
│ ├── routes/ # Express route definitions
│ ├── utils/ # Helper functions
│ └── server.js
│
└── README.md

📊 Admin Dashboard Preview

The admin panel provides:

Overview cards (Total Users, Orders, Products)

Order & revenue charts

Table views for all collections (Users, Orders, Products)

Edit/Delete buttons with modal confirmations

🎥 Live Demo & Screenshots
🌐 Live Demo -> https://mern-ecommerce-26w1-git-main-joes-projects-50075601.vercel.app/

🛍️ Frontend (Vercel) → [https://mern-ecommerce.vercel.app](https://mern-ecommerce-26w1-git-main-joes-projects-50075601.vercel.app/)

⚙️ Backend (Render) → [https://mern-ecommerce-server.onrender.com](https://mern-ecommerce-4ahr.onrender.com/)

🏠 Home Page

Showcases featured products with a responsive slider, category filters, and quick “Add to Cart” buttons.
🖼️ Screenshot:
<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/8506c265-1881-4bfb-a729-60d482a90264" />
<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/1c32ca3f-9183-464a-9a16-303497b11d5f" />
<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/c1aa2eaf-994d-444d-acda-08d4713f688e" />
<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/53f44390-0a13-4dce-91cb-f46516cb22c5" />
<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/ba5fb32e-0ffb-4ea2-b897-3d22d9cf94e8" />

👟 Product Details
Displays detailed product info, multiple images, and an “Add to Cart” button with quantity selector.
<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/a60c09a5-7133-483c-8080-84081f1f3473" />
<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/4b778b32-327b-44e2-a031-f5874a68dde4" />
<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/4471e168-2ab3-4d36-bd49-1353694b737e" />

🛒 Shopping Cart & Checkout
Secure checkout with dynamic cart totals, order summary, and PayPal payment integration.
<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/906d7e39-9383-4523-b139-7da10183bae7" />
<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/3efdc162-5dfb-410b-8c50-3b30a63e04f0" />
<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/ea11f694-9e96-4e48-8dc5-0fd1de661eba" />
<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/33fd0c5c-0d17-4a2f-89eb-d9c636808c4c" />
<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/f3b7a543-caa8-4075-98c2-007db948ff35" />

🔐 User Authentication

JWT-based login and registration with validation and protected routes.
<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/62a3d7b7-7f30-4cbc-af02-d1978ccd48fb" />
<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/b8bca4bc-a492-4ab7-bab2-fac4d07066b4" />

🧑‍💼 Admin Dashboard and 📊 Analytics

A fully functional admin panel that gives control over products, users, and orders — complete with charts and tables.
Real-time visualizations for sales, users, and revenue using Recharts and MongoDB aggregation.
<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/548b0d88-f0d9-460b-9057-887732f676f1" />
<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/1c4f7a0d-9819-41d0-a36e-6b9cbe85588d" />
<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/acb743fe-c965-4a97-88ff-9c8cf1d5665f" />
<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/d909b01d-d55b-42d4-8b02-e2564561efbe" />
<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/b43b53a2-a800-4588-b59b-5d455e0a475a" />
<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/6fbea047-5cce-4cf2-b14b-d01eac94e56e" />

🧑‍💼 Demo Admin Login (add this block)

### 🧑‍💼 Demo Admin Login

Use the following credentials to explore the Admin Dashboard:

Email: iamAdmin@gmail.com

Password: 123456

> ⚠️ _Demo-only account for portfolio showcase. Do not use these credentials in production environments._

⚙️ Tech Architecture

Backend on Render + Frontend on Vercel, communicating via RESTful APIs and JWT authentication.

🧑‍💻 Author

Joshua Kipamet Olting’idi
💼 LinkedIn

🐦 Twitter @JoeKipamet71036

💻 GitHub @joshu1024

⭐ Acknowledgements

MERN Stack Community

Redux Toolkit Team

PayPal Developer Docs

Vite + React Ecosystem

Render & Vercel Docs

💡 If you found this project helpful, please give it a ⭐ on GitHub! It helps others discover it.
![License](https://img.shields.io/github/license/joshu1024/mern-ecommerce)
![React](https://img.shields.io/badge/Frontend-React-blue)
![Node](https://img.shields.io/badge/Backend-Node.js-green)
![MongoDB](https://img.shields.io/badge/Database-MongoDB-brightgreen)
