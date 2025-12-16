# Grocery Store Application

A full-stack grocery store application with React frontend and Node.js/Express backend.

## Features

- 🛒 Shopping cart and wishlist functionality
- 👤 User authentication and authorization
- 🔐 Admin dashboard with protected routes
- 📦 Product management
- 📊 Analytics and reporting
- 💾 MongoDB database integration

## Project Structure

```
grocery-store/
├── src/                    # Frontend React application
│   ├── components/         # Reusable components
│   ├── pages/             # Page components
│   ├── context/           # React Context providers
│   └── assets/            # Static assets
├── server/                # Backend Node.js/Express API
│   ├── config/           # Configuration files
│   ├── models/           # MongoDB models
│   ├── controllers/      # Route controllers
│   ├── routes/           # API routes
│   ├── middleware/       # Custom middleware
│   └── scripts/          # Utility scripts (seeders)
└── package.json          # Frontend dependencies
```

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (installed and running on localhost:27017)
- npm or yarn

### Backend Setup

1. Navigate to the server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the `server` directory:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/grocery-store
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
NODE_ENV=development
```

4. Seed the admin user:
```bash
npm run seed
```

This creates a default admin user:
- Email: `admin@grocerystore.com`
- Password: `admin123`
- Role: `admin`

5. Start the backend server:
```bash
npm run dev
```

The server will run on `http://localhost:5000`

### Frontend Setup

1. From the root directory, install dependencies:
```bash
npm install
```

2. Create a `.env` file in the root directory (optional, defaults to localhost:5000):
```env
VITE_API_URL=http://localhost:5000
```

3. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:5173` (or another port if 5173 is busy)

## Default Admin Credentials

- **Email**: admin@grocerystore.com
- **Password**: admin123

⚠️ **Important**: Change the password after first login in production!

## Available Scripts

### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Backend
- `npm run dev` - Start development server with nodemon
- `npm start` - Start production server
- `npm run seed` - Seed admin user to database

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login user
  - Body: `{ email: string, password: string }`
- `GET /api/auth/me` - Get current user (Protected)
  - Headers: `Authorization: Bearer <token>`

## Technologies Used

### Frontend
- React 19
- React Router DOM
- Tailwind CSS
- Vite
- Lucide React (Icons)

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT (JSON Web Tokens)
- bcryptjs (Password hashing)

## License

This project is private and proprietary.
