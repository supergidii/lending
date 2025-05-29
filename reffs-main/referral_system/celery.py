from __future__ import absolute_import, unicode_literals
import os
from celery import Celery
from django.conf import settings

# Set the default Django settings module
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'referral_system.settings')

app = Celery('referral_system')
app.conf.enable_utc = False
app.conf.timezone = 'Africa/Nairobi'
# Using a string here means the worker doesn't have to serialize
# the configuration object to child processes.
app.config_from_object('django.conf:settings', namespace='CELERY')

# Load task modules from all registered Django app configs.
app.autodiscover_tasks()

# Use database scheduler
app.conf.beat_scheduler = 'django_celery_beat.schedulers:DatabaseScheduler'

@app.task(bind=True, ignore_result=True)
def debug_task(self):
    print(f'Request: {self.request!r}') 