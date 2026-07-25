#!/bin/sh
set -e

mkdir -p /app/uploads
chown -R amena:amena /app/uploads

exec su-exec amena java -jar /app/app.jar
