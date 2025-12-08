FROM python:3.11-slim

WORKDIR /app

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY server.py .
COPY public/ public/

# Expose port
EXPOSE 4242

# Run the application
CMD ["python", "server.py"]

