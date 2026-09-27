# Gunicorn settings, read from the environment so each host can tune them.
import os

bind = f"0.0.0.0:{os.environ.get('PORT', '10000')}"

# Threads let one worker keep serving while another request is still
# uploading or waiting on OpenRouter. Each extra worker adds roughly
# 150-250 MB, so raise WEB_CONCURRENCY only on machines with the memory.
workers = int(os.environ.get('WEB_CONCURRENCY', '1'))
worker_class = 'gthread'
threads = int(os.environ.get('GUNICORN_THREADS', '4'))

timeout = 120
graceful_timeout = 30
keepalive = 5

# Recycle workers now and then so memory from large PDFs is returned
max_requests = 300
max_requests_jitter = 50

accesslog = '-'
