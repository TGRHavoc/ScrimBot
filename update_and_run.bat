@echo off

REM Make sure packages are up to date
call npm install >nul 2>&1

REM Run our app
node app

REM When done, just pause..
PAUSE
