# Stage 1: Build Frontend
FROM node:18-alpine as frontend-build

WORKDIR /app/frontend

COPY frontend/package*.json ./
RUN npm install

COPY frontend/ ./
RUN npm run build

# Stage 2: Build Backend & Final Image
FROM python:3.9-slim

# Install system dependencies
# tesseract-ocr: for text extraction/OCR
# poppler-utils: required by pdf2image (if used)
# libgl1-mesa-glx: required by opencv/gui libs if used (good to have for image processing)
RUN apt-get update && apt-get install -y \
    tesseract-ocr \
    tesseract-ocr-eng \
    poppler-utils \
    libgl1-mesa-glx \
    libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy backend requirements and install
COPY backend/requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend code
COPY backend/ ./backend/

# Copy built frontend static files from Stage 1 to backend/static
COPY --from=frontend-build /app/backend/static ./backend/static

# Expose port
EXPOSE 8000

# Set working directory to backend for uvicorn execution context
WORKDIR /app/backend

# Command to run the application
# Using --host 0.0.0.0 is crucial for Docker containers
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
