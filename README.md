# Quick.ai — AI SaaS App

A full-stack React + Express application that provides AI-powered content and image tools (article writer, blog title generator, image generation, background/object removal, resume review, community feed). The project is split into `client` (React + Vite) and `server` (Express) folders.

---

## Repository layout

- client/ — React front-end (Vite)
  - [client/src/main.jsx](client/src/main.jsx)
  - [client/src/App.jsx](client/src/App.jsx)
  - [client/package.json](client/package.json)
  - [client/vite.config.js](client/vite.config.js)
  - [client/index.html](client/index.html)
  - Pages: [WriteArticle.jsx](client/src/pages/WriteArticle.jsx), [GenerateImages.jsx](client/src/pages/GenerateImages.jsx), [RemoveBackground.jsx](client/src/pages/RemoveBackground.jsx), [RemoveObject.jsx](client/src/pages/RemoveObject.jsx), [ReviewResume.jsx](client/src/pages/ReviewResume.jsx), [BlogTitles.jsx](client/src/pages/BlogTitles.jsx), [Community.jsx](client/src/pages/Community.jsx), [Dashboard.jsx](client/src/pages/Dashboard.jsx)
  - Components: [Navbar.jsx](client/src/components/Navbar.jsx), [Sidebar.jsx](client/src/components/Sidebar.jsx), [CreationItem.jsx](client/src/components/CreationItem.jsx), etc.
  - Vercel rewrite config: [client/vercel.json](client/vercel.json)

- server/ — Express backend
  - Entry: [server/server.js](server/server.js)
  - Routes: [server/routes/aiRoutes.js](server/routes/aiRoutes.js), [server/routes/userRoutes.js](server/routes/userRoutes.js)
  - Controllers:
    - AI: [`generateArticle`, `generateBlogTitle`, `generateImage`, `removeImageBackground`, `removeImageObject`](server/controllers/aiController.js)
    - User: [`getUserCreations`, `getPublishedCreations`, `toggleLikeCreation`](server/controllers/userController.js)
  - Middlewares: [server/middlewares/auth.js](server/middlewares/auth.js), [server/middlewares/multer.js](server/middlewares/multer.js)
  - Utils: [server/utils/db.js](server/utils/db.js), [server/utils/cloudinary.js](server/utils/cloudinary.js)
  - Vercel config: [server/vercel.json](server/vercel.json)

---

## Prerequisites

- Node.js (recommend >= 18)
- npm
- Accounts / API keys for:
  - Cloudinary
  - ClipDrop (text-to-image)
  - Google Gemini / OpenAI (used via `openai` SDK in server)
  - Clerk (authentication)

---

## Environment variables

Create `.env` files in `server/` and `client/` (or set in deployment environment). Required vars used in the code:

Server (`server/.env`):
- DATABASE_URL — Postgres/Neon connection string used in [server/utils/db.js](server/utils/db.js)
- CLOUDINARY_CLOUD_NAME — Cloudinary cloud name used in [server/utils/cloudinary.js](server/utils/cloudinary.js)
- CLOUDINARY_API_KEY — Cloudinary API key
- CLOUDINARY_API_Secret — Cloudinary API secret (note: code reads `CLOUDINARY_API_Secret` in [server/utils/cloudinary.js](server/utils/cloudinary.js) — verify capitalization in your env)
- GEMINI_API_KEY — model API key used by OpenAI client in [server/controllers/aiController.js](server/controllers/aiController.js)
- CLIPDROP_API_KEY — ClipDrop API key used in [server/controllers/aiController.js](server/controllers/aiController.js)
- Clerk server-side keys (if required by your Clerk setup)

Client (`client/.env`):
- VITE_BASE_URL — base URL for API requests (e.g. `http://localhost:8000`)
- VITE_CLERK_PUBLISHABLE_KEY — Clerk publishable key used in [client/src/main.jsx](client/src/main.jsx)

---

## Local development

1. Install dependencies

```sh
# from repo root
cd server
npm install

cd ../client
npm install
```

2. Start server (dev)

```sh
cd server
npm run dev
# or
npm start
```

Server entrypoint: [server/server.js](server/server.js)

3. Start client (dev)

```sh
cd client
npm run dev
```

Client entrypoint: [client/src/main.jsx](client/src/main.jsx)

Notes:
- CORS origin is configured in [server/server.js](server/server.js) (currently `http://localhost:5173`).
- Authentication uses Clerk (`@clerk/express` on server and `@clerk/clerk-react` on client). The server applies `clerkMiddleware()` and [requireAuth] in [server/server.js](server/server.js).
- File uploads use Multer middleware defined in [server/middlewares/multer.js](server/middlewares/multer.js).

---

## Important routes & features

Server API base: /api

- AI routes: [server/routes/aiRoutes.js](server/routes/aiRoutes.js)
  - POST /api/ai/generate-article → [`generateArticle`](server/controllers/aiController.js)
  - POST /api/ai/generate-blog-title → [`generateBlogTitle`](server/controllers/aiController.js)
  - POST /api/ai/generate-image → [`generateImage`](server/controllers/aiController.js)
  - POST /api/ai/remove-image-background → [`removeImageBackground`](server/controllers/aiController.js)
  - POST /api/ai/remove-image-object → [`removeImageObject`](server/controllers/aiController.js)

- User routes: [server/routes/userRoutes.js](server/routes/userRoutes.js)
  - GET /api/user/get-user-creations → [`getUserCreations`](server/controllers/userController.js)
  - GET /api/user/get-published-creations → [`getPublishedCreations`](server/controllers/userController.js)
  - POST /api/user/toggle-like-creations → [`toggleLikeCreation`](server/controllers/userController.js)

Database access uses the Neon serverless client in [server/utils/db.js](server/utils/db.js).

Cloudinary uploads are handled via [server/utils/cloudinary.js](server/utils/cloudinary.js) and used in the AI controller.

---

## Build & Deployment

Client:
- Build: `cd client && npm run build`
- Vercel: [client/vercel.json](client/vercel.json) contains rewrites for the SPA.

Server:
- Start: `cd server && npm start`
- Vercel: [server/vercel.json](server/vercel.json) provided for server deployment.

When deploying, set the same environment variables listed above in your host (Vercel, etc.).

---

## Troubleshooting / gotchas

- Cloudinary env var name in code is `CLOUDINARY_API_Secret` (capitalization matters). Confirm your `.env` matches the variable used in [server/utils/cloudinary.js](server/utils/cloudinary.js).
- Clerk authentication: client and server keys must be correctly configured; [client/src/main.jsx](client/src/main.jsx) throws if `VITE_CLERK_PUBLISHABLE_KEY` is missing.
- Inspect logs from both `client` (Vite) and `server` (nodemon/node) when requests fail. Network calls from the client use `VITE_BASE_URL` in many pages (see `client/src/pages/*`).

---

## Key files (quick links)

- Server entry: [server/server.js](server/server.js)
- Server package: [server/package.json](server/package.json)
- AI controller: [server/controllers/aiController.js](server/controllers/aiController.js) — functions: [`generateArticle`](server/controllers/aiController.js), [`generateBlogTitle`](server/controllers/aiController.js), [`generateImage`](server/controllers/aiController.js), [`removeImageBackground`](server/controllers/aiController.js), [`removeImageObject`](server/controllers/aiController.js)
- User controller: [server/controllers/userController.js](server/controllers/userController.js) — functions: [`getUserCreations`](server/controllers/userController.js), [`getPublishedCreations`](server/controllers/userController.js), [`toggleLikeCreation`](server/controllers/userController.js)
- Routes: [server/routes/aiRoutes.js](server/routes/aiRoutes.js), [server/routes/userRoutes.js](server/routes/userRoutes.js)
- DB util: [server/utils/db.js](server/utils/db.js)
- Cloudinary util: [server/utils/cloudinary.js](server/utils/cloudinary.js)
- Auth middleware: [server/middlewares/auth.js](server/middlewares/auth.js)
- Multer middleware: [server/middlewares/multer.js](server/middlewares/multer.js)

- Client app: [client/src/App.jsx](client/src/App.jsx)
- Client entry: [client/src/main.jsx](client/src/main.jsx)
- Client package: [client/package.json](client/package.json)
- Vite config: [client/vite.config.js](client/vite.config.js)

---

## License

MIT (add license file if needed)

---

If you need a ready-to-use environment template (.env.example) or a deployment checklist, say which target (local / Vercel) and a minimal