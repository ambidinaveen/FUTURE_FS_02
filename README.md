# Mini CRM

A professional mini CRM for managing website leads with a React frontend, Express API, MongoDB persistence, JWT admin auth, and a polished SaaS-style dashboard.

## Features

- JWT admin login with bcrypt password hashing
- Protected dashboard routes
- Lead CRUD and public contact-form lead creation endpoint
- Search, sorting, status filters, notes editing, delete confirmation
- Stats cards, pagination, loading states, empty states, toasts
- Modern glassmorphism UI with a responsive gradient theme

## Tech Stack

- Frontend: React, React Router, Axios, React Toastify, CSS
- Backend: Node.js, Express, MongoDB, Mongoose
- Auth: JWT, bcryptjs

## Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Make sure MongoDB is running locally, or update `.env` with your connection string.

3. Start the app:

   ```bash
   npm run dev
   ```

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:5000`

## Default Admin

The server seeds a default admin on first start if no admin exists.

- Email: `admin@minicrm.com`
- Password: `Admin@12345`

Update these values in `.env` before going to production.

## API Endpoints

- `POST /api/auth/login`
- `GET /api/auth/me`
- `POST /api/auth/logout`
- `GET /api/leads`
- `POST /api/leads`
- `PUT /api/leads/:id`
- `DELETE /api/leads/:id`

## Notes

- `POST /api/leads` is public so it can be used by a website contact form.
- Dashboard read/update/delete actions are protected with JWT.
- If you want to use a different API host, set `VITE_API_URL` in the client environment.
