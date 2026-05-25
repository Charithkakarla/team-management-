# Team Management System with RBAC

A production-style MERN monorepo for managing users, teams, roles, memberships, and dynamically resolved permissions.

## Stack

- Frontend: React, React Router DOM, Axios, Tailwind CSS, Lucide React
- Backend: Node.js, Express, MongoDB, Mongoose, JWT, CORS, dotenv

## Structure

- `client/` - React dashboard app
- `server/` - Express + MongoDB API

## Setup

1. Fill in `server/.env` with your backend values.
2. Fill in `client/.env` with your frontend values.
3. Install dependencies from the repo root.
4. Run `npm run dev` from the root.

## API Endpoints

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/users`
- `POST /api/users`
- `GET /api/teams`
- `POST /api/teams`
- `GET /api/roles`
- `POST /api/roles`
- `PUT /api/roles/:id/permissions`
- `POST /api/memberships/add-user`
- `POST /api/memberships/remove-user`
- `POST /api/memberships/assign-role`
- `PUT /api/memberships/update-role`
- `GET /api/permissions/:userId/:teamId`

## Notes

- Permissions resolve as `user + team -> role -> permissions`.
- If a user has no role for a team, the permissions API returns an empty array.
- The dashboard includes protected routes, dark/light mode, toast notifications, and responsive navigation.
