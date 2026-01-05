# Quick Start - Azure AD SSO Setup

## 🚀 Quick Setup (5 Minutes)

### 1. Azure Portal Setup

1. Go to [Azure Portal](https://portal.azure.com)
2. Navigate to **Azure Active Directory** → **App registrations** → **New registration**
3. Fill in:
   - **Name**: Recruiter Suite
   - **Account types**: Single tenant
   - **Redirect URI**: `http://localhost:5173` (SPA)
4. Click **Register**

### 2. Copy These Values

After registration, copy:
- **Application (client) ID** → for `VITE_AZURE_CLIENT_ID`
- **Directory (tenant) ID** → for `VITE_AZURE_TENANT_ID`

### 3. Create Client Secret

1. Go to **Certificates & secrets** → **New client secret**
2. Copy the **Value** → for `AZURE_CLIENT_SECRET`

### 4. Set Permissions

1. Go to **API permissions** → **Add a permission**
2. Select **Microsoft Graph** → **Delegated permissions**
3. Add: `User.Read`, `openid`, `profile`, `email`
4. Click **Grant admin consent**

### 5. Configure Environment Files

**Frontend (.env)**:
```env
VITE_AZURE_CLIENT_ID=paste-your-client-id
VITE_AZURE_TENANT_ID=paste-your-tenant-id
VITE_AZURE_REDIRECT_URI=http://localhost:5173
VITE_API_URL=/api
```

**Backend (.env)**:
```env
AZURE_CLIENT_ID=paste-your-client-id
AZURE_CLIENT_SECRET=paste-your-client-secret
AZURE_TENANT_ID=paste-your-tenant-id
PORT=3001
FRONTEND_URL=http://localhost:5173
```

### 6. Start Applications

```bash
# Terminal 1 - Backend
cd backend
npm install
npm run dev

# Terminal 2 - Frontend
cd frontend
npm install
npm run dev
```

### 7. Test

1. Open http://localhost:5173
2. Click "Sign in with Microsoft"
3. Login with your Microsoft account
4. You should see the dashboard!

---

## 🔑 Key Files Created

### Frontend
- `src/config/authConfig.ts` - MSAL configuration
- `src/contexts/AuthContext.tsx` - Authentication context
- `src/components/ProtectedRoute/` - Route protection
- `src/hooks/useSSONavigation.ts` - SSO navigation
- Updated: `App.tsx`, `Navbar.tsx`, `UserDropdown.tsx`

### Backend
- `src/middlewares/authMiddleware.ts` - Token validation
- `src/routes/authRoutes.ts` - Auth endpoints

---

## 📝 API Endpoints

### Authentication
- `GET /api/auth/validate` - Validate token
- `GET /api/auth/me` - Get current user

---

## 🛠️ Common Commands

```bash
# Check token in browser console
sessionStorage.getItem('msal.token')

# Test backend auth
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:3001/api/auth/validate

# Clear authentication
sessionStorage.clear()
```

---

## ⚠️ Troubleshooting

**Issue**: Login fails
- ✅ Check Client ID and Tenant ID match Azure Portal
- ✅ Verify Redirect URI is exact match

**Issue**: Token validation fails  
- ✅ Check backend has correct AZURE_TENANT_ID
- ✅ Ensure token hasn't expired

**Issue**: Child apps ask for login
- ✅ Ensure same tenant for all apps
- ✅ Child apps must support silent auth

---

## 🎯 How SSO Works

1. **Login to Recruiter Suite** → Azure AD session created
2. **Click child app link** → Token acquired silently
3. **Child app opens** → Reuses Azure AD session
4. **No re-login needed** → Seamless experience!

---

For detailed documentation, see [SSO_SETUP_GUIDE.md](./SSO_SETUP_GUIDE.md)
