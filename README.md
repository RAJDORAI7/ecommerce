# 🛒 MERN E-Commerce Platform

A full-stack e-commerce application built with the **MERN** stack (MongoDB, Express.js, React, Node.js).

---

## 📁 Project Structure

```
ecommerce/
├── backend/          # Express + MongoDB REST API
│   ├── config/       # DB & environment config
│   ├── controllers/  # Route controllers
│   ├── middleware/   # Auth, error handling middleware
│   ├── models/       # Mongoose schemas
│   ├── routes/       # API route definitions
│   ├── utils/        # Helper utilities
│   └── server.js     # Entry point
│
└── frontend/         # React + Vite SPA
    ├── public/       # Static assets
    └── src/
        ├── api/      # Axios API service calls
        ├── assets/   # Images, icons
        ├── components/ # Reusable UI components
        ├── context/  # React Context (Auth, Cart)
        ├── hooks/    # Custom React hooks
        ├── pages/    # Page-level components
        ├── routes/   # Protected & public routes
        └── utils/    # Helper functions
```

---

## 🚀 Features

### Backend
- 🔐 JWT-based Authentication & Authorization
- 👤 User Management (Register, Login, Profile)
- 📦 Product CRUD with image upload (Multer + Cloudinary)
- 🗂️ Categories Management
- 🛒 Cart & Order Management
- ⭐ Product Reviews & Ratings
- 💳 Payment Integration (Stripe)
- 🔎 Product Search, Filter & Pagination
- 🛡️ Admin Dashboard Routes

### Frontend
- ⚛️ React 18 + Vite
- 🎨 Modern UI with Glassmorphism & Dark theme
- 🛍️ Product Listing, Detail, Cart & Checkout
- 👤 User Auth (Register/Login)
- 📊 Admin Dashboard (Products, Orders, Users)
- 🔔 Toast Notifications
- 📱 Fully Responsive Design

---

## ⚙️ Getting Started

### Prerequisites
- Node.js >= 18.x
- MongoDB (local or Atlas)
- npm or yarn

### 1. Clone & Install

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Environment Variables

**Backend** — create `backend/.env`:
```env
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://localhost:27017/ecommerce
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRE=30d
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
STRIPE_SECRET_KEY=your_stripe_secret_key
```

**Frontend** — create `frontend/.env`:
```env
VITE_API_URL=http://localhost:5000/api
VITE_STRIPE_PUBLIC_KEY=your_stripe_public_key
```

### 3. Run Development Servers

```bash
# Terminal 1 — Backend
cd backend
npm run dev

# Terminal 2 — Frontend
cd frontend
npm run dev
```

- **Backend API**: http://localhost:5000
- **Frontend App**: http://localhost:5173

---

## 🏗️ Tech Stack

| Layer      | Technology                              |
|------------|-----------------------------------------|
| Frontend   | React 18, Vite, React Router v6         |
| State Mgmt | React Context + useReducer              |
| Styling    | CSS Modules + Custom CSS Variables      |
| Backend    | Node.js, Express.js                     |
| Database   | MongoDB + Mongoose                      |
| Auth       | JWT + bcryptjs                          |
| File Upload| Multer + Cloudinary                     |
| Payments   | Stripe                                  |
| Dev Tools  | Nodemon, ESLint, Prettier               |

---

## 📜 API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST   | /api/auth/register | Register user |
| POST   | /api/auth/login    | Login user |
| GET    | /api/auth/profile  | Get profile |
| PUT    | /api/auth/profile  | Update profile |

### Products
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET    | /api/products | Get all products |
| GET    | /api/products/:id | Get single product |
| POST   | /api/products | Create product (Admin) |
| PUT    | /api/products/:id | Update product (Admin) |
| DELETE | /api/products/:id | Delete product (Admin) |
| POST   | /api/products/:id/reviews | Add review |

### Orders
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST   | /api/orders | Create order |
| GET    | /api/orders/myorders | Get user orders |
| GET    | /api/orders/:id | Get order by ID |
| PUT    | /api/orders/:id/pay | Update order to paid |
| GET    | /api/orders | Get all orders (Admin) |

### Cart
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET    | /api/cart | Get user cart |
| POST   | /api/cart | Add item to cart |
| PUT    | /api/cart/:itemId | Update cart item |
| DELETE | /api/cart/:itemId | Remove cart item |
| DELETE | /api/cart | Clear cart |

---

## 👨‍💻 Contributing
1. Fork the project
2. Create your feature branch (`git checkout -b feature/amazing`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing`)
5. Open a Pull Request

---

## 📄 License
MIT
