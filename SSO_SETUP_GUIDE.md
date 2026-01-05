# Microsoft Azure AD SSO Implementation Guide

## 🎯 Overview

This guide provides complete setup instructions for implementing Single Sign-On (SSO) across the Recruiter Suite and its child applications using Microsoft Azure AD (Entra ID).

## 📋 Architecture

### Authentication Flow
1. User logs into **Recruiter Suite** with Microsoft account
2. Azure AD issues access token and ID token
3. MSAL stores authentication session in browser
4. When navigating to child apps, the existing Azure AD session is reused
5. Child apps silently authenticate using the same Azure AD tenant

### Key Components
- **Frontend**: React + MSAL Browser (@azure/msal-react)
- **Backend**: Node.js + MSAL Node (@azure/msal-node) + JWT validation
- **Identity Provider**: Microsoft Azure AD (Entra ID)
- **Protocol**: OAuth 2.0 / OpenID Connect

---

## 🔧 Azure AD Configuration

### Step 1: Register Recruiter Suite Application in Azure Portal

1. **Navigate to Azure Portal**
   - Go to https://portal.azure.com
   - Search for "Azure Active Directory" or "Microsoft Entra ID"

2. **Register New Application**
   ```
   - Click "App registrations" → "New registration"
   - Name: "Recruiter Suite"
   - Supported account types: "Accounts in this organizational directory only (Single tenant)"
   - Redirect URI:
     • Platform: Single-page application (SPA)
     • URI: http://localhost:5173 (for development)
     • Add production URI when deploying
   ```

3. **Note the Following Values**
   - **Application (client) ID** → This is your `VITE_AZURE_CLIENT_ID`
   - **Directory (tenant) ID** → This is your `VITE_AZURE_TENANT_ID`

4. **Create Client Secret (for backend)**
   ```
   - Go to "Certificates & secrets"
   - Click "New client secret"
   - Description: "Recruiter Suite Backend"
   - Expires: Choose appropriate duration (recommended: 24 months)
   - Copy the VALUE immediately → This is your `AZURE_CLIENT_SECRET`
   ```

5. **Configure API Permissions**
   ```
   - Go to "API permissions"
   - Click "Add a permission"
   - Select "Microsoft Graph"
   - Choose "Delegated permissions"
   - Add these permissions:
     ✓ User.Read
     ✓ openid
     ✓ profile
     ✓ email
   - Click "Grant admin consent" (requires admin privileges)
   ```

6. **Configure Authentication**
   ```
   - Go to "Authentication"
   - Under "Implicit grant and hybrid flows":
     ✓ Check "ID tokens"
   - Under "Advanced settings":
     • Allow public client flows: No
   - Save changes
   ```

### Step 2: Configure Child Applications

For each child application (Resume Formatter, Legal Compliance, Referrals):

**Option A: Use Same App Registration (Recommended for SSO)**
- All apps use the same Client ID and Tenant ID
- Ensures seamless SSO across all applications
- Add each app's redirect URI to the same app registration

**Option B: Separate App Registrations**
- Each app has its own registration
- Must all be in the **same tenant**
- Configure cross-app trust if needed

---

## 🔐 Environment Configuration

### Frontend Environment Variables

Create `frontend/.env` file:

```env
# Microsoft Azure AD Configuration
VITE_AZURE_CLIENT_ID=your-application-client-id-here
VITE_AZURE_TENANT_ID=your-tenant-id-here
VITE_AZURE_REDIRECT_URI=http://localhost:5173

# API Configuration
VITE_API_URL=/api

# Child Application URLs (for SSO)
VITE_RESUME_FORMATTER_URL=https://resume-formatter.reddesert-f6724e64.centralus.azurecontainerapps.io/
VITE_LEGAL_COMPLIANCE_URL=https://frontend.reddesert-f6724e64.centralus.azurecontainerapps.io
VITE_REFERRAL_SYSTEM_URL=https://referal-frontend.reddesert-f6724e64.centralus.azurecontainerapps.io/
```

### Backend Environment Variables

Create `backend/.env` file:

```env
# Microsoft Azure AD Configuration
AZURE_CLIENT_ID=your-application-client-id-here
AZURE_CLIENT_SECRET=your-client-secret-here
AZURE_TENANT_ID=your-tenant-id-here

# Server Configuration
PORT=3001
NODE_ENV=development

# CORS Configuration
FRONTEND_URL=http://localhost:5173
```

---

## 🚀 Installation & Setup

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Dependencies installed:
# - @azure/msal-browser@^3.x
# - @azure/msal-react@^2.x

# Create .env file with your Azure AD credentials
cp .env.example .env
# Edit .env with your actual values

# Start development server
npm run dev
```

### Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Dependencies installed:
# - @azure/msal-node
# - dotenv
# - jsonwebtoken
# - jwks-rsa

# Create .env file with your Azure AD credentials
cp .env.example .env
# Edit .env with your actual values

# Start development server
npm run dev
```

---

## 📁 File Structure

### Frontend Authentication Files

```
frontend/src/
├── config/
│   └── authConfig.ts              # MSAL configuration
├── contexts/
│   └── AuthContext.tsx            # Authentication context provider
├── hooks/
│   ├── useApi.ts                  # API hook (existing)
│   └── useSSONavigation.ts        # SSO navigation hook
├── components/
│   ├── ProtectedRoute/            # Route protection component
│   │   ├── ProtectedRoute.tsx
│   │   └── index.ts
│   ├── UserDropdown/              # Updated with auth
│   │   └── UserDropdown.tsx
│   └── Navbar/                    # Updated with SSO
│       └── Navbar.tsx
└── App.tsx                        # Updated with MSAL provider
```

### Backend Authentication Files

```
backend/src/
├── middlewares/
│   └── authMiddleware.ts          # JWT token validation
└── routes/
    └── authRoutes.ts              # Authentication endpoints
```

---

## 🔄 SSO Flow Explanation

### Initial Login
```
1. User opens Recruiter Suite
2. Not authenticated → Shows "Sign in with Microsoft" button
3. User clicks sign in
4. Redirected to Microsoft login page
5. User enters credentials
6. Azure AD validates and redirects back with tokens
7. MSAL stores tokens in sessionStorage
8. User is now authenticated
```

### Navigating to Child Applications
```
1. User is authenticated in Recruiter Suite
2. User clicks on "Resume Formatter" link
3. useSSONavigation hook:
   a. Gets fresh access token from MSAL
   b. Opens child app in new tab
4. Child app checks for existing Azure AD session
5. If session exists → Silent authentication (no login prompt)
6. Child app grants access immediately
```

### How It Works
- **Shared Azure AD Session**: Browser maintains session cookies for login.microsoftonline.com
- **Same Tenant**: All apps registered in same Azure AD tenant
- **Automatic Reuse**: Child apps detect existing session and skip login

---

## 🛡️ Security Considerations

### Token Storage
- **Access Tokens**: Stored in `sessionStorage` (cleared on tab close)
- **Refresh Tokens**: Managed by MSAL, not directly accessible
- **No LocalStorage**: Prevents XSS attacks from accessing tokens

### Token Validation (Backend)
```typescript
- Validates token signature using Azure AD public keys (JWKS)
- Checks token expiration
- Verifies issuer (Azure AD tenant)
- Confirms audience (your Client ID)
```

### Best Practices Implemented
✅ Tokens never in URLs
✅ Server-side validation
✅ Short token lifetimes
✅ HTTPS only in production
✅ CORS properly configured
✅ No secrets in frontend code

---

## 🧪 Testing the Implementation

### Test Authentication Flow

1. **Start both servers**
   ```bash
   # Terminal 1 - Backend
   cd backend && npm run dev

   # Terminal 2 - Frontend
   cd frontend && npm run dev
   ```

2. **Open browser**
   - Navigate to http://localhost:5173
   - Should see "Sign in with Microsoft" page

3. **Login**
   - Click "Sign in with Microsoft"
   - Enter your Microsoft credentials
   - Should be redirected back to dashboard

4. **Verify Authentication**
   - User avatar should appear in top-right
   - Click avatar to see user info
   - Should show name and email from Microsoft

5. **Test SSO to Child Apps**
   - Click "Legal Compliance" in navbar
   - Should open in new tab
   - Should NOT ask for login (if child app configured correctly)

### Test Token Validation

```bash
# Get access token from browser console
# After logging in, run in browser console:
sessionStorage.getItem('msal.token')

# Test backend validation
curl -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  http://localhost:3001/api/auth/validate
```

---

## 🔍 Troubleshooting

### Common Issues

#### 1. "Login failed" or infinite redirect loop
**Solution:**
- Verify Redirect URI in Azure Portal matches exactly
- Check that Client ID and Tenant ID are correct
- Ensure app registration allows "ID tokens"

#### 2. "Token validation failed"
**Solution:**
- Verify backend has correct AZURE_TENANT_ID
- Check that token hasn't expired
- Ensure AZURE_CLIENT_ID matches frontend

#### 3. Child apps still ask for login
**Solution:**
- Ensure child apps use same Azure AD tenant
- Check that child apps are configured for silent authentication
- Verify child apps use same Client ID (Option A)

#### 4. CORS errors
**Solution:**
- Update backend CORS configuration
- Add child app domains to allowed origins

---

## 📚 Additional Resources

### Microsoft Documentation
- [MSAL.js Documentation](https://learn.microsoft.com/en-us/azure/active-directory/develop/msal-overview)
- [Azure AD App Registration](https://learn.microsoft.com/en-us/azure/active-directory/develop/quickstart-register-app)
- [OAuth 2.0 and OpenID Connect](https://learn.microsoft.com/en-us/azure/active-directory/develop/v2-protocols)

### Code References
- [@azure/msal-browser](https://www.npmjs.com/package/@azure/msal-browser)
- [@azure/msal-react](https://www.npmjs.com/package/@azure/msal-react)
- [@azure/msal-node](https://www.npmjs.com/package/@azure/msal-node)

---

## 🎓 Next Steps

### Production Deployment

1. **Update Redirect URIs**
   - Add production URLs to Azure app registration
   - Update environment variables

2. **Enable HTTPS**
   - Required for production
   - Configure SSL certificates

3. **Update CORS**
   - Add production domains to backend CORS config

4. **Secret Management**
   - Use Azure Key Vault for secrets
   - Never commit .env files

5. **Monitoring**
   - Set up Azure AD sign-in logs
   - Monitor token usage and errors

---

## ✅ Checklist

Before going live, ensure:

- [ ] Azure AD app registration complete
- [ ] All environment variables configured
- [ ] Frontend and backend running locally
- [ ] Successfully logged in with Microsoft
- [ ] User info displayed correctly
- [ ] Child app SSO tested
- [ ] Token validation working
- [ ] CORS configured properly
- [ ] No secrets in code
- [ ] Production redirect URIs added

---

## 🆘 Support

For issues or questions:
1. Check troubleshooting section above
2. Review Microsoft Azure AD documentation
3. Check MSAL GitHub issues
4. Contact your Azure AD administrator

---

**Last Updated:** January 5, 2026
**Version:** 1.0.0
