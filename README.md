# Team Management System with RBAC

A production-style MERN monorepo for managing users, teams, roles, memberships, and dynamically resolved permissions.

## Stack

- Frontend: React, React Router DOM, Axios, Tailwind CSS, Lucide React
- Backend: Node.js, Express, MongoDB, Mongoose, JWT, CORS, dotenv

## Structure

- `client/src/ui/core.jsx` - shared buttons, cards, inputs, tables, modals, and other repeatable UI pieces
- `client/src/navigation/guards.jsx` - all route protection in one place
- `client/src/ui/Sidebar.jsx`, `client/src/ui/Navbar.jsx`, `client/src/ui/FloatingAssistant.jsx` - the main dashboard shell
- `client/src/views/` - page-level screens such as login, dashboard, users, teams, tasks, roles, and permissions
- `server/src/features/` - grouped backend features for auth, users, teams, roles, permissions, memberships, tasks, and chat
- `server/src/routes.js` - one registry file that mounts every API route
- `server/src/shared/`, `server/src/middleware/`, `server/src/dataModels/` - shared helpers, auth/error middleware, and MongoDB models

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
- Privileged accounts are seeded through `server/.env`: `ADMIN_EMAIL` and `MANAGER_EMAIL`.
- Store secret keys only in `server/.env`; do not add API keys to the client.
- Most reusable UI now lives in one shared file to keep the project easier to explain and maintain.
- The backend is grouped by feature now, so each file maps to one topic instead of splitting the same idea across service, controller, and route folders.
