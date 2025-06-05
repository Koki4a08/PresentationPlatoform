@echo off
echo Starting Git operations...

echo Adding all changes...
git add .

echo Committing changes...
set /p message="Enter commit message (or press Enter for default): "
if "%message%"=="" set message="Auto-commit: %date% %time%"

git commit -m "%message%"

echo Pushing to GitHub...
git push

echo Git operations completed!
pause 