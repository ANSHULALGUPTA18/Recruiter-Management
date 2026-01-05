# Recruiter Suite - Unified Workspace Dashboard

A production-ready SaaS dashboard application with **Microsoft Azure AD Single Sign-On (SSO)** authentication, React frontend, and Node.js backend.

## 🌟 Key Features

- ✅ **Microsoft Azure AD SSO** - Single sign-on across all applications
- ✅ **Secure Authentication** - OAuth 2.0 / OpenID Connect
- ✅ **Modern UI** - React 18 with Tailwind CSS
- ✅ **RESTful API** - Node.js/Express backend
- ✅ **Type-Safe** - Full TypeScript implementation
- ✅ **Protected Routes** - Secure access control

## Tech Stack

### Frontend
- React 18 with Vite
- TypeScript
- Tailwind CSS
- Lucide Icons
- React Router DOM
- Axios
- **@azure/msal-browser** - Microsoft authentication
- **@azure/msal-react** - React integration

### Backend
- Node.js with Express
- TypeScript
- RESTful API architecture
- CORS enabled
- **@azure/msal-node** - Token validation
- **jsonwebtoken** - JWT verification
- **jwks-rsa** - Azure AD key validation

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
- **Microsoft Azure AD (Entra ID) account** with app registration permissions

### Quick Start

For a **5-minute setup**, see [QUICK_START.md](./QUICK_START.md)

For **detailed documentation**, see [SSO_SETUP_GUIDE.md](./SSO_SETUP_GUIDE.md)

### Installation

1. **Clone the repository**
   ```bash
   cd Recruiter-Management
   ```

2. **Setup Azure AD** (Required)
   - Create app registration in Azure Portal
   - Get Client ID, Tenant ID, and Client Secret
   - See [QUICK_START.md](./QUICK_START.md) for step-by-step instructions

3. **Configure Environment Variables**
   
   **Frontend** - Create `frontend/.env`:
   ```env
   VITE_AZURE_CLIENT_ID=your-client-id
   VITE_AZURE_TENANT_ID=your-tenant-id
   VITE_AZURE_REDIRECT_URI=http://localhost:5173
   VITE_API_URL=/api
   ```
   
   **Backend** - Create `backend/.env`:
   ```env
   AZURE_CLIENT_ID=your-client-id
   AZURE_CLIENT_SECRET=your-client-secret
   AZURE_TENANT_ID=your-tenant-id
   PORT=3001
   FRONTEND_URL=http://localhost:5173
   ```

4. **Install Backend Dependencies**
   ```bash
   cd backend
   npm install
   ```

5. **Install Frontend Dependencies**
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
   The backend will start at `http://localhost:3001`

2. **Start the Frontend Development Server**
   ```bash
   cd frontend
   npm run dev
   ```
   The frontend will start at `http://localhost:5173`

3. **Open in Browser & Login**
   - Navigate to `http://localhost:5173`
   - Click "Sign in with Microsoft"
   - Login with your Microsoft account
   - Access the dashboard!

## 🔐 SSO Architecture

### How Single Sign-On Works

1. **User logs into Recruiter Suite** using Microsoft Azure AD
2. **Authentication session** is stored by MSAL in browser
3. **Child applications** (Resume Formatter, Legal Compliance, Referrals) share the same Azure AD tenant
4. **Silent authentication** - When navigating to child apps, existing session is reused
5. **No re-login required** - Seamless experience across all applications

### Key Components

- **Frontend Auth**: `@azure/msal-react` + `@azure/msal-browser`
- **Backend Validation**: JWT verification with Azure AD public keys
- **Token Storage**: sessionStorage (secure, cleared on tab close)
- **SSO Navigation**: Custom hook for seamless app switching

## API Endpoints

### Authentication
- `GET /api/auth/validate` - Validate Azure AD token
- `GET /api/auth/me` - Get current authenticated user

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
- `POST /api/quick-links` - Create new quick link
- `DELETE /api/quick-links/:id` - Delete quick link

## Features

### Authentication & Security
- ✅ Microsoft Azure AD Single Sign-On
- ✅ Protected routes and API endpoints
- ✅ JWT token validation
- ✅ Secure token storage (sessionStorage)
- ✅ Automatic token refresh
- ✅ Silent authentication for child apps

### Dashboard Features
- ✅ Responsive SaaS dashboard layout
- ✅ Fixed top navigation bar with dropdown menus
- ✅ User profile dropdown with logout
- ✅ Job statistics cards
- ✅ Quick links management (add/delete)
- ✅ Right-side slide panel for adding links
- ✅ Loading and error states
- ✅ Clean component-based architecture

## Environment Variables

See `.env.example` files in both frontend and backend directories.

### Required Frontend Variables
```env
VITE_AZURE_CLIENT_ID          # Azure AD Application ID
VITE_AZURE_TENANT_ID          # Azure AD Tenant ID  
VITE_AZURE_REDIRECT_URI       # Redirect URI after login
VITE_API_URL                  # Backend API URL
```

### Required Backend Variables
```env
AZURE_CLIENT_ID               # Azure AD Application ID
AZURE_CLIENT_SECRET           # Azure AD Client Secret
AZURE_TENANT_ID               # Azure AD Tenant ID
PORT                          # Server port (default: 3001)
FRONTEND_URL                  # Frontend URL for CORS
```

## 📚 Documentation

- **[QUICK_START.md](./QUICK_START.md)** - 5-minute setup guide
- **[SSO_SETUP_GUIDE.md](./SSO_SETUP_GUIDE.md)** - Complete SSO implementation guide
- **[.env.example](./frontend/.env.example)** - Frontend environment template
- **[.env.example](./backend/.env.example)** - Backend environment template

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

### Production Checklist
- [ ] Update Azure AD redirect URIs with production URLs
- [ ] Enable HTTPS (required for production)
- [ ] Update CORS configuration for production domains
- [ ] Use Azure Key Vault for secrets management
- [ ] Set up Azure AD sign-in monitoring
- [ ] Configure production environment variables

## 🆘 Troubleshooting

### Login Issues
- Verify Client ID and Tenant ID in `.env` files
- Check Azure Portal redirect URI matches exactly
- Ensure "ID tokens" is enabled in Azure app registration

### Token Validation Fails
- Verify backend has correct `AZURE_TENANT_ID`
- Check token hasn't expired
- Ensure `AZURE_CLIENT_ID` matches across frontend/backend

### SSO Not Working with Child Apps
- Confirm all apps use same Azure AD tenant
- Verify child apps support silent authentication
- Check that browser allows third-party cookies

For more troubleshooting, see [SSO_SETUP_GUIDE.md](./SSO_SETUP_GUIDE.md#-troubleshooting)

## 🤝 Contributing

1. Create feature branch
2. Make changes
3. Test authentication flow
4. Submit pull request

## License

MIT
