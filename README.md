# MERN Auth App

A full-stack MERN (MongoDB, Express, React, Node.js) authentication application with role-based access control.

## Features

- User authentication (Login/Register)
- JWT-based authentication
- Role-based access control (User, Manager, Admin)
- Beautiful, polished UI with inline styles
- Responsive design
- MongoDB Atlas integration

## Tech Stack

- **Frontend:** React, React Router, Axios, Vite
- **Backend:** Node.js, Express, MongoDB (Mongoose), JWT, bcryptjs
- **Database:** MongoDB Atlas

## Getting Started

### Prerequisites

- Node.js
- MongoDB Atlas account

### Installation

1. Clone the repository
2. Install backend dependencies:
   ```bash
   cd backend
   npm install
   ```
3. Install frontend dependencies:
   ```bash
   cd frontend
   npm install
   ```
4. Create a `.env` file in the `backend` directory with:
   ```
   PORT=5000
   MONGODB_URI=your_mongodb_atlas_uri
   JWT_SECRET=your_secret_key
   FRONTEND_URL=http://localhost:5173
   NODE_ENV=development
   ```

### Running the App

Use the provided start script:
```bash
python start.py
```

Or start servers separately:
```bash
# Backend
cd backend
node server.js

# Frontend (new terminal)
cd frontend
npm run dev
```

## Project Structure

```
merno/
├── backend/           # Express server
│   ├── server.js      # Main server file
│   ├── package.json
│   └── .env
├── frontend/          # React app
│   ├── src/
│   │   ├── pages/     # Login, Register, Dashboards
│   │   ├── components/ # Navbar, Card, Alert, StatisticsCard
│   │   ├── App.jsx
│   │   └── index.css
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── start.py           # Script to start both servers
└── README.md
```

## License

MIT
