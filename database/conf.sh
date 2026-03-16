#!/bin/sh
set -eu

PGDATA="/var/lib/postgresql/data"
PGSOCKET="/run/postgresql"

DB_USER="${DB_USER:-}"
DB_PASS="${DB_PASS:-}"
DB_NAME="${DB_NAME:-}"

if [ -z "$DB_USER" ] || [ -z "$DB_PASS" ] || [ -z "$DB_NAME" ]; then
    echo "ERROR: Missing required env vars. Set DB_USER, DB_PASS, DB_NAME." >&2
    exit 1
fi

chown -R postgres:postgres "$PGDATA"
chown -R postgres:postgres "$PGSOCKET"

if [ ! -f "$PGDATA/PG_VERSION" ]; then
    echo "Initializing PostgreSQL database cluster..."
    su-exec postgres initdb -D "$PGDATA"

    # Allow password auth from container network and listen on all interfaces.
    echo "host all all 0.0.0.0/0 md5" >> "$PGDATA/pg_hba.conf"
    echo "listen_addresses = '*'" >> "$PGDATA/postgresql.conf"
fi

echo "Starting PostgreSQL for bootstrap..."
su-exec postgres pg_ctl -D "$PGDATA" -o "-c listen_addresses='*'" -w start

echo "Ensuring role/database from env variables..."
su-exec postgres psql -v ON_ERROR_STOP=1 --dbname postgres \
    --set=db_user="$DB_USER" \
    --set=db_pass="$DB_PASS" \
    --set=db_name="$DB_NAME" <<'SQL'
DO
$$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = :'db_user') THEN
        EXECUTE format('CREATE ROLE %I LOGIN PASSWORD %L', :'db_user', :'db_pass');
    ELSE
        EXECUTE format('ALTER ROLE %I WITH LOGIN PASSWORD %L', :'db_user', :'db_pass');
    END IF;
END
$$;
SQL

su-exec postgres psql -v ON_ERROR_STOP=1 --dbname postgres \
    --set=db_user="$DB_USER" \
    --set=db_name="$DB_NAME" <<'SQL'
SELECT format('CREATE DATABASE %I OWNER %I', :'db_name', :'db_user')
WHERE NOT EXISTS (SELECT 1 FROM pg_database WHERE datname = :'db_name')
\gexec

SELECT format('GRANT ALL PRIVILEGES ON DATABASE %I TO %I', :'db_name', :'db_user')
\gexec
SQL

echo "Stopping bootstrap PostgreSQL..."
su-exec postgres pg_ctl -D "$PGDATA" -m fast -w stop

echo "Starting PostgreSQL in foreground..."
exec su-exec postgres postgres -D "$PGDATA" -c listen_addresses='*'