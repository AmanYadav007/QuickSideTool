# Runs the API anywhere Docker does (Render, Oracle Cloud, a VPS).
FROM python:3.11-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1 \
    MALLOC_ARENA_MAX=2 \
    PORT=10000

WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt

COPY app.py gunicorn.conf.py ./

RUN useradd --create-home app
USER app

EXPOSE 10000
CMD ["gunicorn", "-c", "gunicorn.conf.py", "app:app"]
