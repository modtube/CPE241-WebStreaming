# 🎬 ModTube — CPE241 Streaming Platform

A full-stack movie streaming platform built for the **CPE241 Database Systems** course.
The stack consists of a **PostgreSQL 16** database, an **Express + TypeScript** backend API, and a **React + Vite + TypeScript** frontend.

---

## 📁 Project Structure

```text
cpe241/
├── docker-compose.yml          # Orchestrates db + pgAdmin + backend
├── .env.example                # Template for environment variables
├── .env                        # Your local env file (created from .env.example)
│
├── database/
│   ├── 01_schema.sql           # Table definitions & constraints (auto-run on first init)
│   ├── 02_seed.sql             # Sample data (auto-run on first init)
│   ├── 03_query.sql            # Business analytics queries
│   └── diagrams/               # ERD (Chen, Crow's Foot) and Relational Schema
│
├── backend/                    # Express + TypeScript API (runs inside Docker)
│   ├── Dockerfile
│   ├── package.json
│   └── src/
│       ├── index.ts            # Entry point — mounts all routes
│       ├── config/db.ts        # PostgreSQL connection pool
│       ├── controllers/        # Business logic (movie, transaction, user, …)
│       ├── routes/             # REST endpoints
│       └── middlewares/        # JWT authentication
│
└── frontend/                   # React + Vite (runs on host, NOT in Docker)
    ├── package.json
    ├── vite.config.ts
    └── src/
        ├── pages/              # admin / customer / auth pages
        ├── components/
        ├── layouts/
        └── context/
```

---

## ✅ Prerequisites

Install these on your machine before starting:

| Tool | Version | Purpose |
|---|---|---|
| [Docker Desktop](https://www.docker.com/products/docker-desktop/) | latest | Runs the database, pgAdmin, and backend |
| [Node.js](https://nodejs.org/) | 20.x or newer | Required to run the frontend |
| [Yarn](https://classic.yarnpkg.com/lang/en/docs/install/) | classic (v1) | Frontend package manager (`npm install -g yarn`) |

> 💡 The **backend and database run inside Docker** — you do **not** need to install PostgreSQL or set up Node manually for them.
> Only the **frontend runs natively** on your host machine via Vite.

---

## 🚀 First-Time Setup (Fresh Clone)

Follow these steps if this is your **first time running** the project after cloning the repo.

### 1. Create your `.env` file

Copy the template into a real env file at the **project root**:

```bash
cp .env.example .env
```

The defaults in `.env.example` work out of the box. Adjust them only if a port (5432, 5000, 8080, 5173) is already in use on your machine.

```env
DB_HOST=localhost
DB_USER=admin
DB_PASSWORD=cpe38Final
DB_NAME=modtube_db
DB_PORT=5432

BACKEND_PORT=5000

VITE_API_URL=http://localhost:5000/api
DATABASE_URL=postgresql://admin:cpe38Final@localhost:5432/modtube_db

JWT_SECRET=cpe38Final
```

### 2. Start the database, pgAdmin, and backend (Docker)

From the project root:

```bash
docker compose up -d --build
```

What happens here:
- 🐘 **PostgreSQL 16** starts on port `5432` and **auto-runs** `01_schema.sql` then `02_seed.sql` on the first launch
- 🛠 **pgAdmin** starts on port `8080`
- 🚏 **Backend** image is built from `backend/Dockerfile`, waits for the DB health check, then runs `yarn dev` on port `5000`

Verify everything is up:

```bash
docker compose ps
```

You should see `streaming_db_container`, `streaming_pgadmin`, and `modtube-backend` all marked **healthy / running**.

Check the seed completed successfully:

```bash
docker logs streaming_db_container | tail -20
```

Look for: `PostgreSQL init process complete; ready for start up.`

### 3. Install frontend dependencies and start it

The frontend runs **outside Docker**, directly on your machine.

```bash
cd frontend
yarn install
yarn dev
```

Vite will print a local URL (typically `http://localhost:5173`). Open it in your browser.

### 4. You're done 🎉

| Service | URL | Credentials |
|---|---|---|
| Frontend (React) | http://localhost:5173 | — |
| Backend API | http://localhost:5000 | — |
| pgAdmin | http://localhost:8080 | `admin@admin.com` / `admin` |
| PostgreSQL | `localhost:5432` | `admin` / `cpe38Final` (db: `modtube_db`) |

---

## 🔄 Re-launching After a Shutdown

Use this section when you've already done the first-time setup before and just need to start things back up.

### Case A — You ran `docker compose down` (data preserved)

The named volume `postgres_data` still holds your database, so the schema and seed will **NOT** re-run.

```bash
# From project root
docker compose up -d

# In a separate terminal
cd frontend
yarn dev
```

That's it. Your data, users, and any changes you made are still there.

### Case B — You ran `docker compose down -v` (data wiped)

The `-v` flag deletes the `postgres_data` volume, so the next startup will **re-run** `01_schema.sql` and `02_seed.sql` from scratch.

```bash
# From project root
docker compose up -d

# In a separate terminal
cd frontend
yarn dev
```

The database will reseed automatically — you'll get a clean copy of all sample data again.

### Case C — You changed `backend/` code

The backend container runs `yarn dev` with `tsx watch`, so source edits are picked up automatically via the bind-mount in `docker-compose.yml`.

If you change `backend/package.json` (added a dependency) or `backend/Dockerfile`, rebuild the image:

```bash
docker compose up -d --build backend
```

### Case D — You changed `docker-compose.yml` or `.env`

```bash
docker compose down
docker compose up -d
```

---

## 🛠 Useful Commands

```bash
# Tail logs for any service
docker compose logs -f backend
docker compose logs -f db

# Stop everything (keeps data)
docker compose down

# Stop everything and wipe the database
docker compose down -v

# Rebuild only the backend image
docker compose build backend

# Open a psql shell inside the DB container
docker exec -it streaming_db_container psql -U admin -d modtube_db

# Re-seed without dropping the volume (run inside the container)
docker exec -it streaming_db_container psql -U admin -d modtube_db -f /home/database_scripts/02_seed.sql
```

---

## 🔌 Connecting via pgAdmin

1. Open http://localhost:8080
2. Log in with `admin@admin.com` / `admin`
3. Right-click **Servers → Register → Server…**
4. **General tab** → Name: `ModTube`
5. **Connection tab**:
   - Host: `db` ← (use the service name, **not** `localhost`, because pgAdmin runs inside Docker)
   - Port: `5432`
   - Database: `modtube_db`
   - Username: `admin`
   - Password: `cpe38Final`
6. Save.

---

## 🧪 Testing the API

A Postman collection is included at the project root:

```
CPE241-WebStreaming API.postman_collection.json
```

Import it into Postman to try the endpoints. The base URL is `http://localhost:5000/api`.

Quick sanity check from the terminal:

```bash
curl http://localhost:5000/api/status
# → {"message":"Backend is ready!"}
```

---

## 🚑 Troubleshooting

**Port already in use (`5432`, `5000`, `8080`, or `5173`)**
Edit `.env` (for `DB_PORT` and `BACKEND_PORT`) or `docker-compose.yml` (for pgAdmin's `8080:80`) and pick a free port. For the frontend Vite port, run `yarn dev --port <new-port>`.

**Backend container keeps restarting**
The DB likely isn't healthy yet. Check `docker compose logs db`. If you see an init script error, run `docker compose down -v && docker compose up -d` to wipe and re-seed.

**Frontend can't reach the API (CORS / network errors)**
Confirm `VITE_API_URL` in `.env` matches the backend URL (`http://localhost:5000/api` by default) and that the backend container is healthy.

**Schema or seed changed but DB still has old data**
The init scripts only run on a fresh volume. Wipe and recreate:
```bash
docker compose down -v && docker compose up -d
```

**`yarn install` fails on the frontend**
Make sure Node ≥ 20 and Yarn (classic v1) are installed: `node -v && yarn -v`.

---

## 👥 Team

CPE241 — Database Systems, Semester 2 / 2568
KMUTT, Department of Computer Engineering
