@echo off
echo Starting Celery worker with solo pool...
celery -A referral_system worker -l info --pool=solo 