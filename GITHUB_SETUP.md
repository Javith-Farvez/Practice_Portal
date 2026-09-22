# GitHub OAuth Integration — Complete Setup Guide

> **Portal:** Placement Practice Portal  
> **Backend:** https://practice-portal-kmri.onrender.com  
> **Frontend:** https://practice-portal-mu.vercel.app

---

## Overview

This portal uses **GitHub OAuth App** authorization. Each portal user independently connects their own GitHub account through the official GitHub authorization page. No personal access tokens or passwords are required.

**Security architecture:**
- Client secret lives only in Render backend environment (never in frontend code or Vercel)
- Access tokens are encrypted with AES-256-CBC before database storage
- CSRF state tokens prevent OAuth hijacking
- Each user's GitHub connection is isolated by their portal `user_id`

---

## Step 1 — Create a GitHub OAuth App

You only need **one OAuth App** for the entire portal. Both users (kamalikasenthilnaathan09 and Javith-Farvez) will authorize through this same app independently.

1. Log in to **either** GitHub account (or a dedicated org account)
2. Go to: **https://github.com/settings/developers**
3. Click **"OAuth Apps"** → **"New OAuth App"**
4. Fill in the form:

| Field | Value |
|---|---|
| **Application name** | `Placement Practice Portal` |
| **Homepage URL** | `https://practice-portal-mu.vercel.app` |
| **Application description** | *(optional)* Push Java solutions to GitHub |
| **Authorization callback URL** | `https://practice-portal-kmri.onrender.com/api/github/callback` |

5. Click **"Register application"**
6. On the next page:
   - Copy the **Client ID** (e.g. `Ov23liXXXXXXXXXXXXXX`)
   - Click **"Generate a new client secret"**
   - Copy the secret **immediately** — it's shown only once

> ⚠️ **Critical:** The callback URL must match **exactly** (including `https://`, no trailing slash) with what you set in `GITHUB_CALLBACK_URL` in Render.

---

## Step 2 — Generate a Secure Encryption Key

The portal encrypts GitHub access tokens before storing them in the database. You need a unique 32-byte (64 hex character) key.

Run this in any terminal:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**Example output:** `eab9db19d62e2511366ca3a85e868acf8105acd1f59682fe27295249edd170dd`

> ⚠️ **Warning:** If you change this key after users have connected GitHub, their stored tokens will fail to decrypt and they will need to reconnect. Generate the key once and keep it stable.

---

## Step 3 — Configure Render Backend Environment Variables

1. Go to **https://dashboard.render.com**
2. Open your backend service (e.g. `practice-portal-kmri`)
3. Click **"Environment"** tab
4. Add these environment variables:

| Variable | Value |
|---|---|
| `GITHUB_CLIENT_ID` | Your Client ID from Step 1 |
| `GITHUB_CLIENT_SECRET` | Your Client Secret from Step 1 |
| `GITHUB_CALLBACK_URL` | `https://practice-portal-kmri.onrender.com/api/github/callback` |
| `GITHUB_OAUTH_SCOPES` | `read:user,repo` |
| `GITHUB_ENCRYPTION_KEY` | Your 64-char hex key from Step 2 |
| `CLIENT_URL` | `https://practice-portal-mu.vercel.app` |

5. Click **"Save Changes"**
6. Click **"Manual Deploy"** → **"Deploy latest commit"**

> 🔒 **Never** put `GITHUB_CLIENT_SECRET`, `GITHUB_ENCRYPTION_KEY`, access tokens, or any secret in Vercel frontend environment variables.

---

## Step 4 — Configure Vercel Frontend Environment Variable

1. Go to **https://vercel.com/dashboard**
2. Open your frontend project
3. Go to **"Settings"** → **"Environment Variables"**
4. Ensure this variable exists:

| Variable | Value |
|---|---|
| `VITE_API_URL` | `https://practice-portal-kmri.onrender.com` |

> ✅ This is the **only** GitHub-related variable that goes in Vercel, and it's just the backend URL — no secret.

5. If you changed this variable, redeploy the frontend.

---

## Step 5 — Run Database Migration (First Time Only)

The GitHub integration requires 3 tables in your Supabase database. If you haven't run this yet:

1. Go to **https://supabase.com/dashboard** → your project → **SQL Editor**
2. Open and run the SQL file: [`database/github_integration_migration.sql`](./database/github_integration_migration.sql)

This creates:
- `github_connections` — stores encrypted tokens per portal user
- `github_oauth_states` — CSRF state tokens (10-minute TTL)
- `github_push_logs` — audit log of all pushes

---

## Step 6 — Verify the Deployment

After Render finishes deploying:

### 6a. Check the health endpoint (no login required)
```
GET https://practice-portal-kmri.onrender.com/api/github/health
```

Expected response when **correctly configured:**
```json
{
  "success": true,
  "data": {
    "configured": true,
    "missing_variables": [],
    "callback_url": "https://practice-portal-kmri.onrender.com/api/github/callback"
  }
}
```

If `configured` is `false`, the `missing_variables` array will tell you exactly which env vars are still placeholder values.

### 6b. Test the full flow

1. Log into the portal → **Settings** → **GitHub Integration**
2. The amber warning banner should be **gone**
3. The **"Connect GitHub"** button should be active (not greyed out)
4. Click **"Connect GitHub"** → you are redirected to `github.com/login/oauth/authorize`
5. Authorize the app → you are redirected back to:  
   `https://practice-portal-mu.vercel.app/settings?github=connected&username=...`
6. A green success banner shows: "✅ Successfully connected GitHub account (@username)"
7. Click **"Load My Repositories"** → your repos appear in the dropdown
8. Select a repository and branch → click **"Confirm Repository"**
9. Open any coding problem → write code → click **"Push to GitHub"**
10. Confirm the push → a commit URL appears → open it to verify on GitHub

---

## Step 7 — Test Both GitHub Accounts

Test with **kamalikasenthilnaathan09** and **Javith-Farvez** independently:

1. Log in as User A → Connect GitHub → authorize as `kamalikasenthilnaathan09`
2. Verify their repos load and push works
3. Log in as User B → Connect GitHub → authorize as `Javith-Farvez`
4. Verify their repos load (different repos) and push works
5. Confirm User A's Settings does not show User B's repos (and vice versa)

---

## Troubleshooting

### "redirect_uri_mismatch" error from GitHub
The `GITHUB_CALLBACK_URL` in Render does not match the "Authorization callback URL" in the GitHub OAuth App settings. They must be identical character-for-character.

### "GitHub OAuth is not configured" warning still showing
The Render deploy hasn't completed yet, or one of the env vars still has a placeholder value. Check:
```
GET https://practice-portal-kmri.onrender.com/api/github/health
```

### "Failed to fetch repositories" after connecting
The token may have been stored with the wrong encryption key. Disconnect GitHub (via Settings → Disconnect) and reconnect. This re-encrypts with the current key.

### "No push access" error when selecting a repository
The connected GitHub account doesn't have write (`push`) access to the selected repository. Select a repository the user owns or has explicit write permissions on.

### Rate limit errors
The portal uses a GitHub API rate limit of 30 requests per 15 minutes. Authenticated GitHub API requests have a limit of 5,000/hour from GitHub's side.

---

## File Structure After Push

Each submitted solution is committed with this structure:

```
placement-solutions/
└── Java/
    └── <Topic-Name>/
        └── <Problem-Name>/
            ├── Solution.java   ← Java code with problem header comment
            └── README.md       ← Problem description + metadata table
```

Example:
```
placement-solutions/Java/Arrays/Two_Sum/Solution.java
placement-solutions/Java/Arrays/Two_Sum/README.md
```

---

## Security Summary

| What | Where stored |
|---|---|
| `GITHUB_CLIENT_ID` | Render env (safe-ish — not a secret) |
| `GITHUB_CLIENT_SECRET` | Render env only — never in frontend |
| `GITHUB_ENCRYPTION_KEY` | Render env only — never in frontend |
| GitHub access tokens | Database (AES-256-CBC encrypted) |
| Token passed to frontend | Never — only commit URL is returned |
| User isolation | Enforced by `user_id` FK on all DB queries |
| CSRF protection | State token stored in `github_oauth_states` |

---

*Last updated: September 2026*
