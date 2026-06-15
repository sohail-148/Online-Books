# 📚 Online Books

A full-stack e-commerce web application for browsing, searching, and purchasing books online. Built with **React**, **Node.js**, **Express**, and **MongoDB**.

---

## ✨ Features

### 🛍️ Shopping
- Browse a curated collection of books
- Product detail page with full description, edition, and publish year
- Add to Cart / Remove from Cart with live quantity tracking
- Cart persisted in `localStorage` — survives page refresh
- "Buy Now" — adds to cart and goes straight to checkout

### 🔍 Search & Filter
- Live search bar — fully client-side, instant, no extra network requests
- Filter by price range (min / max)
- Filter by edition
- Sort by price (ascending toggle)
- All filters compose together with search — no conflicts

### 🔐 Authentication
- Register / Login with JWT-based auth
- Passwords hashed with bcrypt
- Auth state persisted in `localStorage`
- Protected routes (checkout, orders) redirect to login

### 🧾 Checkout & Orders
- Shipping address form with inline validation (phone, pincode)
- Order placed to backend with full item + address data
- Order confirmation page with itemised summary
- Order history page listing all past orders with status badges

### 🎨 UI / UX
- Skeleton loader while books are fetching
- Empty state SVG illustrations for "no results" and "empty cart"
- Toast notifications for all cart and auth actions
- Dark mode toggle
- Responsive layout (mobile-friendly)
- Dynamic browser tab titles per page (`Book Title — Online Books`)
- Sticky header with search bar, animated account dropdown, cart badge

---

## 🗂️ Project Structure

```
Online-Books/
├── backend/
│   ├── middleware/
│   │   └── auth.js              # JWT verification middleware
│   ├── models/
│   │   ├── User.js              # User schema (bcrypt password hashing)
│   │   └── Order.js             # Order schema with items + shipping address
│   ├── routes/
│   │   ├── authRoutes.js        # POST /register, POST /login, GET /me
│   │   └── orderRoutes.js       # POST /orders, GET /myorders, GET /:id
│   ├── .env                     # Environment variables (not committed)
│   ├── package.json
│   └── server.js                # Express app, book routes, DB seed
│
└── frontend/
    ├── public/
    │   └── index.html
    └── src/
        ├── components/
        │   ├── Header.jsx           # Sticky header: search, dropdown, cart icon
        │   ├── ProductItem.jsx      # Individual book card with stars, truncated desc
        │   ├── ProductList.jsx      # Book listing with filters + skeleton loader
        │   └── ProtectedRoute.jsx   # Redirects unauthenticated users to /login
        ├── context/
        │   ├── authContext.js       # Auth state (login / register / logout)
        │   └── itemContext.js       # Products, cart, client-side search & filter
        ├── pages/
        │   ├── Cart.jsx / cart.css
        │   ├── Checkout.jsx / Checkout.css
        │   ├── Login.jsx / Register.jsx / auth.css
        │   ├── NotFound.jsx / NotFound.css
        │   ├── OrderConfirmation.jsx / OrderConfirmation.css
        │   ├── OrderHistory.jsx / OrderHistory.css
        │   └── ProductDetail.jsx / ProductDetail.css
        ├── App.js                   # Route definitions
        └── App.css                  # Global styles, dark mode, responsive
```

> **Note:** The `hooks/` folder visible on GitHub is empty. The `usePageTitle` hook was
> originally placed there but inlined directly into each component to avoid a webpack
> resolution issue. The empty folder can be ignored.

---

## 🚀 Getting Started

### Prerequisites
- Node.js ≥ 18
- MongoDB running locally (or an Atlas connection string)

### 1. Clone the repo

```bash
git clone https://github.com/sohail-148/Online-Books.git
cd Online-Books
```

### 2. Backend setup

```bash
cd backend
npm install
```

Create `backend/.env`:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/newdatabase
JWT_SECRET=your_secret_key_here
JWT_EXPIRES_IN=7d
```

Start the server:

```bash
npm start
```

The backend seeds the database automatically on first run if the collection is empty.

### 3. Frontend setup

```bash
cd frontend
npm install
```

Create `frontend/.env`:

```env
REACT_APP_API_URL=http://localhost:5000
```

Start the dev server:

```bash
npm start
```

Open [http://localhost:3000](http://localhost:3000)

---

## ☁️ Deployment

### Recommended stack

| Part | Platform |
|------|----------|
| Frontend | [Vercel](https://vercel.com) |
| Backend | [Render](https://render.com) |
| Database | [MongoDB Atlas](https://cloud.mongodb.com) |

### Backend → Render
- Root directory: `backend`
- Build command: `npm install`
- Start command: `npm start`
- Environment variables: `MONGO_URI`, `JWT_SECRET`, `JWT_EXPIRES_IN`, `PORT`

### Frontend → Vercel
- Root directory: `frontend`
- Framework preset: Create React App
- Environment variable: `REACT_APP_API_URL=https://<your-render-url>`

---

## 🔌 API Endpoints

### Books
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/books` | Get all books |
| GET | `/api/books/:id` | Get book by ID |
| POST | `/api/books` | Add a new book |
| PUT | `/api/books/:id` | Update a book |
| DELETE | `/api/books/:id` | Delete a book |

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login and receive JWT |
| GET | `/api/auth/me` | Get current user (auth required) |

### Orders
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/orders` | Place an order (auth required) |
| GET | `/api/orders/myorders` | Get current user's orders (auth required) |
| GET | `/api/orders/:id` | Get single order (auth required, owner only) |

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, React Router v7, react-hot-toast |
| State | React Context API + localStorage |
| Backend | Node.js, Express 4 |
| Database | MongoDB + Mongoose 8 |
| Auth | JWT (jsonwebtoken) + bcryptjs |
| Styling | Plain CSS — no framework |

---

## 📝 Environment Variables

### Backend (`backend/.env`)
| Variable | Description |
|----------|-------------|
| `PORT` | Server port (default: 5000) |
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret key for signing JWTs |
| `JWT_EXPIRES_IN` | JWT expiry duration (e.g. `7d`) |

### Frontend (`frontend/.env`)
| Variable | Description |
|----------|-------------|
| `REACT_APP_API_URL` | Backend base URL (default: `http://localhost:5000`) |

---

## 📄 License

MIT
