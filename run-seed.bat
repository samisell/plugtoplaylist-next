@echo off
REM Database seed script for Windows
REM This script will create admin users in your database

echo.
echo 🌱 Running Prisma seed...
echo.

echo Installing tsx if needed...
npm install tsx --save-dev

echo.
echo Generating Prisma client...
call npx prisma generate

echo.
echo Running seed script...
call npx prisma db seed

echo.
echo ✅ Seed complete!
echo.
pause
