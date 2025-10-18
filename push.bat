@echo off
set /p commitmsg=Enter commit message: 

git init
git add .
git commit -m "%commitmsg%"
git branch -M main
git remote add origin https://github.com/Demigod122111/IntellibusOct2025.git
git push -u origin main
pause