# 🎬 CPE241-WebStreaming

A PostgreSQL-based streaming platform database designed for high-performance analytics and user engagement tracking.

### 🚀 Quick Start (Team Guide)

To get the database up and running on your local machine, follow these steps:

1. **Prerequisites**: Ensure you have [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed.
2. **Launch**: Open your terminal in the project root and run:

```bash
docker compose up -d

```

3. **Verify**: Once the container is "Up", run this command to check if the data seeded correctly:

```bash
docker logs streaming_db_container

```

_You should see `PostgreSQL init process complete; ready for start up.` at the bottom._

---

### 📁 Project Structure

```text
/streaming-platform-project
├── docker-compose.yml       # Docker configuration for Postgres 16
└── /database
    ├── /diagrams            # ERD and Class Diagrams for the DB
    ├── 01_schema.sql        # Table definitions & constraints (Auto-run)
    ├── 02_seed.sql          # Sample data (~1,000+ rows) (Auto-run)
    └── queries.sql          # 16 Business analytics queries

```

---

### 🛠 Connection Details

Connect your database tool (DBeaver, pgAdmin, or VS Code SQL Tools) using:

- **Host**: `localhost`
- **Port**: `5432`
- **Database**: `streamingDB`
- **User**: `admin`
- **Password**: `cpe@38Final`

---

### 🛠 Troubleshooting

- **Data Refresh**: If you need to reset the database to its original state, run:

```bash
docker compose down -v && docker compose up -d

```

- **Port Conflict**: If port `5432` is already in use, change the port mapping in `docker-compose.yml` to `"5433:5432"`.
