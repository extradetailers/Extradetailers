FROM python:3.13-slim

# Python runtime settings
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /app

# Install system deps (safe default for Django)
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Install Python deps (layer caching)
COPY requirements.txt .
RUN pip install --upgrade pip \
    && pip install --no-cache-dir -r requirements.txt

# Copy app code
COPY . .

# Make entrypoint executable
RUN chmod +x /app/entrypoint.sh

# Cloud Run injects PORT
ENV PORT=8080

# Run as non-root (Cloud Run best practice)
RUN useradd -m appuser
USER appuser

# Entrypoint handles migrations + gunicorn
ENTRYPOINT ["/app/entrypoint.sh"]

CMD ["gunicorn", "--chdir", "/app", "core.wsgi:application"]
