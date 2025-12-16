# Quick Setup Guide

## Step 1: Backend Setup

1. **Navigate to server directory:**
   ```bash
   cd server
   ```

2. **Install backend dependencies:**
   ```bash
   npm install
   ```

3. **Create `.env` file in `server/` directory:**
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/grocery-store
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   NODE_ENV=development
   ```

4. **Make sure MongoDB is running:**
   - MongoDB should be installed and running on your localhost
   - Default connection: `mongodb://localhost:27017`

5. **Seed the admin user:**
   ```bash
   npm run seed
   ```
   
   This will automatically:
   - Connect to MongoDB
   - Create the `grocery-store` database
   - Create the `users` collection
   - Create a default admin user with:
     - Email: `admin@grocerystore.com`
     - Password: `admin123`
     - Role: `admin`

6. **Start the backend server:**
   ```bash
   npm run dev
   ```
   
   Server will run on `http://localhost:5000`

## Step 2: Frontend Setup

1. **From the root directory, install dependencies:**
   ```bash
   npm install
   ```

2. **Create `.env` file in root (optional):**
   ```env
   VITE_API_URL=http://localhost:5000
   ```
   
   If not created, it defaults to `http://localhost:5000`

3. **Start the frontend development server:**
   ```bash
   npm run dev
   ```
   
   Frontend will run on `http://localhost:5173`

## Step 3: Access Admin Dashboard

1. Open your browser and go to: `http://localhost:5173/admin/login`

2. Use the default credentials:
   - **Email**: `admin@grocerystore.com`
   - **Password**: `admin123`

3. After successful login, you'll be redirected to the admin dashboard at `/admin/dashboard`

## Troubleshooting

### MongoDB Connection Issues
- Make sure MongoDB is installed and running
- Check if MongoDB service is running: `mongod` or check Windows services
- Verify connection string in `.env` file

### Port Already in Use
- Backend: Change `PORT` in `server/.env`
- Frontend: Vite will automatically use next available port

### Admin User Already Exists
- If you see "Admin user already exists" when running seed:
  - You can either delete the user from MongoDB
  - Or use the existing credentials to login

### CORS Issues
- The backend already has CORS enabled
- Make sure frontend URL matches `VITE_API_URL` in frontend `.env`

## What Was Created

### Backend Structure
- ✅ Express.js server with MongoDB connection
- ✅ User model with password hashing
- ✅ Authentication controller and routes
- ✅ JWT middleware for protected routes
- ✅ Admin seeder script
- ✅ Database auto-creation on connection

### Frontend Structure
- ✅ Admin login page
- ✅ Authentication context
- ✅ Protected routes for admin
- ✅ Admin layout with sidebar and navbar
- ✅ Admin dashboard UI
- ✅ Logout functionality

### Database
- ✅ MongoDB database: `grocery-store`
- ✅ Collection: `users`
- ✅ Default admin user seeded

## Next Steps

- Change the default admin password after first login
- Add more admin users through the API or MongoDB
- Implement additional admin features (products, orders, etc.)
- Add more authentication features (password reset, etc.)

