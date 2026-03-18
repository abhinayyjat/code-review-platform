# code-review-platform
# 🔍 CodeReview AI

> AI-powered code review platform. Paste code, get instant structured feedback.

![CI](https://github.com/abhinayyjat/code-review-platform/actions/workflows/ci.yml/badge.svg)

**Live Demo:** [https://code-review-platform-production-d98f.up.railway.app]

## ✨ Features

- 🤖 **AI Code Reviews** — Gemini 1.5 Flash analyses code for security, performance, and best practices
- ⚡ **Real-time Streaming** — Watch the AI review appear word by word via Socket.io
- 📊 **Analytics Dashboard** — Track code quality trends over time with Recharts
- 🔗 **GitHub Webhooks** — Auto-review code on every git push
- 👥 **Team Workspaces** — Invite team members, role-based access control
- 🛡️ **Rate Limiting** — Redis-based per-user rate limiting via Upstash
- 🔐 **GitHub OAuth** — Secure authentication with JWT

## 🏗️ Tech Stack

| Layer     | Technology |
|-----------|-----------|
| Frontend  | React + Vite, Zustand, Monaco Editor, Socket.io-client, Recharts |
| Backend   | Node.js + Express, Mongoose, Socket.io, Passport.js |
| Database  | MongoDB Atlas |
| AI        | Google Gemini 1.5 Flash |
| Cache     | Upstash Redis |
| Auth      | GitHub OAuth2 + JWT |
| Deploy    | Railway (backend), Vercel (frontend) |
| CI/CD     | GitHub Actions |

## 🚀 Running Locally

```bash
# Clone
git clone https://github.com/abhinayyjat/code-review-platform
cd code-review-platform

# Install all dependencies
npm install && npm install --prefix server && npm install --prefix client

# Set up environment variables
cp server/.env.example server/.env
# Fill in: MONGODB_URI, JWT_SECRET, JWT_REFRESH_SECRET,
#          GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET, GEMINI_API_KEY

# Start both servers
npm run dev
```

## 🏛️ Architecture

```
client/                   React + Vite frontend
server/src/
  config/                 env validation, DB, passport
  models/                 User, Review, Team (Mongoose)
  routes/                 Express routers
  controllers/            Request/response handlers
  services/               Business logic + AI calls
  middleware/             Auth, RBAC, rate limiting, error handling
  sockets/                Socket.io streaming
  utils/                  Prompts, async handler
```

## 🔒 Security

- JWT access tokens (15min expiry)
- GitHub OAuth tokens stored with `select: false`
- Webhook HMAC signature verification
- Redis rate limiting per user
- Helmet security headers
- CORS restricted to frontend origin
- Input validation + body size limits

## 📸 Screenshots

<!-- Add screenshots after deployment -->

## 📄 License

MIT
