#!/bin/bash
webpack --progress --watch --colors &
celery -A ide worker --app=ide.celery_app  --loglevel=info &
python manage.py runserver 0.0.0.0:8000

