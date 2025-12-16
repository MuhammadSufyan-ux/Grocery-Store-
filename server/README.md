# Grocery Store Backend API

## Setup Instructions

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the server directory with the following variables:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/grocery-store
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
NODE_ENV=development
```

3. Make sure MongoDB is running on your localhost

4. Seed the admin user:
```bash
npm run seed
```

This will create a default admin user with:
- Email: admin@grocerystore.com
- Password: admin123
- Role: admin

5. Start the server:
```bash
npm run dev
```

The server will run on http://localhost:5000

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (Protected)

## Default Admin Credentials
- Email: admin@grocerystore.com
- Password: admin123

⚠️ **Important**: Change the password after first login in production!

