#!/bin/bash

COMPOSE="/usr/bin/docker compose"
DOCKER="/usr/bin/docker"

cd /home/ocstudios/ledokku/
$COMPOSE run certbot renew --dry-run && $COMPOSE kill -s SIGHUP webserver
$DOCKER system prune -af