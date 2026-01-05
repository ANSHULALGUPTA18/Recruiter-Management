# Azure AD Configuration Checklist

Use this checklist to ensure your Azure AD SSO is properly configured.

## ☑️ Azure Portal Configuration

### App Registration
- [ ] Created "Recruiter Suite" app registration
- [ ] Selected "Single tenant" account type
- [ ] Added SPA redirect URI: `http://localhost:5173`
- [ ] Noted Application (client) ID
- [ ] Noted Directory (tenant) ID

### Client Secret
- [ ] Created new client secret
- [ ] Copied secret VALUE immediately
- [ ] Set appropriate expiration (recommended: 24 months)

### API Permissions
- [ ] Added Microsoft Graph permissions:
  - [ ] User.Read
  - [ ] openid
  - [ ] profile
  - [ ] email
- [ ] Granted admin consent for permissions

### Authentication Settings
- [ ] Enabled "ID tokens" under Implicit grant
- [ ] Set "Allow public client flows" to No
- [ ] Saved all changes

## ☑️ Environment Configuration

### Frontend (.env)
- [ ] Created `frontend/.env` file
- [ ] Set `VITE_AZURE_CLIENT_ID`
- [ ] Set `VITE_AZURE_TENANT_ID`
- [ ] Set `VITE_AZURE_REDIRECT_URI=http://localhost:5173`
- [ ] Set `VITE_API_URL=/api`
- [ ] Verified no spaces or quotes around values

### Backend (.env)
- [ ] Created `backend/.env` file
- [ ] Set `AZURE_CLIENT_ID`
- [ ] Set `AZURE_CLIENT_SECRET`
- [ ] Set `AZURE_TENANT_ID`
- [ ] Set `PORT=3001`
- [ ] Set `FRONTEND_URL=http://localhost:5173`
- [ ] Verified no spaces or quotes around values

## ☑️ Dependencies Installation

### Frontend
- [ ] Ran `npm install` in frontend directory
- [ ] Verified `@azure/msal-browser` installed
- [ ] Verified `@azure/msal-react` installed
- [ ] No installation errors

### Backend
- [ ] Ran `npm install` in backend directory
- [ ] Verified `@azure/msal-node` installed
- [ ] Verified `jsonwebtoken` installed
- [ ] Verified `jwks-rsa` installed
- [ ] Verified `dotenv` installed
- [ ] No installation errors

## ☑️ Application Testing

### Initial Setup
- [ ] Backend server starts without errors (`npm run dev`)
- [ ] Frontend server starts without errors (`npm run dev`)
- [ ] Browser opens to `http://localhost:5173`
- [ ] No console errors on page load

### Authentication Flow
- [ ] "Sign in with Microsoft" button appears
- [ ] Clicking sign-in opens Microsoft login page
- [ ] Can login with Microsoft account
- [ ] Redirected back to dashboard after login
- [ ] User name appears in top-right avatar
- [ ] No authentication errors in console

### User Profile
- [ ] Clicking avatar shows dropdown
- [ ] User name displayed correctly
- [ ] User email displayed correctly
- [ ] Logout button present and clickable
- [ ] Clicking logout signs out user

### API Integration
- [ ] Dashboard loads without errors after login
- [ ] Quick links display correctly
- [ ] Can add new quick link
- [ ] Can delete quick link
- [ ] No API authentication errors

### SSO to Child Apps (If configured)
- [ ] Child apps use same Azure AD tenant
- [ ] Clicking child app link opens in new tab
- [ ] Child app does NOT prompt for login
- [ ] Child app loads correctly with user session

## ☑️ Security Verification

### Token Storage
- [ ] Tokens stored in sessionStorage (not localStorage)
- [ ] Token cleared when logging out
- [ ] Token cleared when closing tab/browser
- [ ] No tokens visible in URL

### Backend Validation
- [ ] API calls require Bearer token
- [ ] Invalid tokens are rejected (401 status)
- [ ] Expired tokens trigger re-authentication
- [ ] `/api/auth/validate` endpoint works

### CORS Configuration
- [ ] Frontend can make API calls to backend
- [ ] No CORS errors in browser console
- [ ] Credentials are included in requests

## ☑️ Production Readiness (When Deploying)

### Azure AD Updates
- [ ] Added production redirect URI to Azure app registration
- [ ] Updated frontend `.env` with production URI
- [ ] Updated backend CORS for production domain
- [ ] Tested login flow on production URL

### Security
- [ ] Using HTTPS in production
- [ ] Secrets stored in Azure Key Vault or secure vault
- [ ] `.env` files added to `.gitignore`
- [ ] No secrets committed to git

### Monitoring
- [ ] Set up Azure AD sign-in logs monitoring
- [ ] Configured error tracking
- [ ] Set up usage analytics
- [ ] Documented troubleshooting procedures

## 📋 Quick Reference

### Common Values
```
Client ID:     xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx (from Azure Portal)
Tenant ID:     xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx (from Azure Portal)
Client Secret: xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx (from Azure Portal)
```

### Port Numbers
```
Frontend:  5173 (default Vite)
Backend:   3001 (configured in .env)
```

### Key URLs
```
Azure Portal:        https://portal.azure.com
Local Frontend:      http://localhost:5173
Local Backend:       http://localhost:3001
Backend Health:      http://localhost:3001/health
Token Validation:    http://localhost:3001/api/auth/validate
```

## ✅ All Done?

If all items are checked:
1. Your Azure AD SSO is properly configured
2. Authentication is working correctly
3. API integration is functional
4. Ready for development/testing

## 🚨 Issues?

If any items are NOT checked, refer to:
- [QUICK_START.md](./QUICK_START.md) for setup steps
- [SSO_SETUP_GUIDE.md](./SSO_SETUP_GUIDE.md) for detailed documentation
- Troubleshooting section in SSO_SETUP_GUIDE.md

---

**Configuration Date:** _____________  
**Configured By:** _____________  
**Production Deployment Date:** _____________
