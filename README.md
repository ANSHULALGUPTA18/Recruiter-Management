# Unified Workspace Dashboard

A production-ready SaaS dashboard application with React frontend and Node.js backend.

## Tech Stack

### Frontend
- React 18 with Vite
- TypeScript
- Tailwind CSS
- Lucide Icons
- React Router DOM
- Axios

### Backend
- Node.js with Express
- TypeScript
- RESTful API architecture
- CORS enabled

## Project Structure

```
unified/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar/
│   │   │   ├── Sidebar/
│   │   │   ├── JobCard/
│   │   │   ├── QuickLinkCard/
│   │   │   └── UserDropdown/
│   │   ├── layouts/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── hooks/
│   │   └── constants/
│   └── package.json
├── backend/
│   ├── src/
│   │   ├── routes/
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── models/
│   │   └── middlewares/
│   └── package.json
└── README.md
```

## Getting Started

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   cd unified
   ```

2. **Install Backend Dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install Frontend Dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

### Running the Application

1. **Start the Backend Server**
   ```bash
   cd backend
   npm run dev
   ```
   The backend will start at `http://localhost:5000`

2. **Start the Frontend Development Server**
   ```bash
   cd frontend
   npm run dev
   ```
   The frontend will start at `http://localhost:5173`

3. **Open in Browser**
   Navigate to `http://localhost:5173`

## API Endpoints

### User
- `GET /api/user/profile` - Get user profile

### Tasks
- `GET /api/tasks` - Get all tasks
- `POST /api/tasks` - Create a new task
- `PATCH /api/tasks/:id` - Update a task
- `DELETE /api/tasks/:id` - Delete a task

### Jobs
- `GET /api/jobs/summary` - Get job summary statistics

### Quick Links
- `GET /api/quick-links` - Get all quick links

## Features

- Responsive SaaS dashboard layout
- Fixed top navigation bar with dropdown menus
- To-Do list sidebar with CRUD operations
- Job statistics cards
- Quick links grid
- User profile dropdown
- Loading and error states
- Clean component-based architecture

## Environment Variables

### Frontend (.env)
```
VITE_API_URL=/api
```

### Backend
```
PORT=5000
```

## Building for Production

### Backend
```bash
cd backend
npm run build
npm start
```

### Frontend
```bash
cd frontend
npm run build
npm run preview
```

## License

MIT
