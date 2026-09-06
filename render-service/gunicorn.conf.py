import os
bind = '0.0.0.0:' + os.environ.get('PORT', '10000')
workers = 1  # One shared in-memory leaderboard; do not increase.
threads = 4
worker_class = 'gthread'
timeout = 60
accesslog = '-'
errorlog = '-'
