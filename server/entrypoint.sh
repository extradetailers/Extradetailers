#!/bin/bash
set -e

echo "Running migrations..."
# makemigrations should NOT run in production (can cause schema drift)
# python manage.py makemigrations --noinput
python manage.py migrate --noinput

echo "Collecting static files..."
python manage.py collectstatic --noinput

echo "Starting Gunicorn on port ${PORT}..."
exec gunicorn \
  --chdir /app \
  core.wsgi:application \
  --bind 0.0.0.0:${PORT} \
  --workers 2 \
  --threads 4 \
  --timeout 0
