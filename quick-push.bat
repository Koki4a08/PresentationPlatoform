@echo off
echo Quick Git Push...

git add .
git commit -m "Quick update: %date% %time%"
git push

echo Changes pushed to GitHub!
pause 