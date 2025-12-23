-- Create user if not exists
DO
$$
BEGIN
   IF NOT EXISTS (
      SELECT FROM pg_catalog.pg_roles WHERE rolname = 'shayon'
   ) THEN
      CREATE ROLE shayon LOGIN PASSWORD 'Test1234';
   END IF;
END
$$;

-- Create database if not exists
DO
$$
BEGIN
   IF NOT EXISTS (
      SELECT FROM pg_database WHERE datname = 'extradetailers_db'
   ) THEN
      CREATE DATABASE extradetailers_db OWNER shayon;
   END IF;
END
$$;

-- Grant all privileges
GRANT ALL PRIVILEGES ON DATABASE extradetailers_db TO shayon;
