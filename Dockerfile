# Dockerfile
FROM python:3.10-slim

# System libs needed by Pillow (JPEG/zlib) + basics
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libjpeg62-turbo-dev \
    zlib1g-dev \
    curl \
 && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Install deps first for better layer caching
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the app (no big model files; server.py will download from MODEL_URL)
COPY . .

# Cloud Run provides $PORT; bind to it (shell form expands $PORT)
ENV PYTHONUNBUFFERED=1
CMD exec gunicorn -k gthread -w 1 --threads 2 --timeout 120 -b 0.0.0.0:$PORT server:app
