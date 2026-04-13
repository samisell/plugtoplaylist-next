#!/bin/sh

# Run migrations if DATABASE_URL is set
if [ -n "$DATABASE_URL" ]; then
  echo "Running database migrations..."
  npx prisma migrate deploy
fi

# Start the application
echo "Starting the application..."
node server.js
