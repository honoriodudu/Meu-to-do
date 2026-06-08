@echo off
echo Instalando dependências do Supabase...
echo.

echo Verificando se o npm está disponível...
npm --version >nul 2>&1
if errorlevel 1 (
    echo npm não encontrado. Por favor, instale Node.js primeiro.
    pause
    exit /b 1
)

echo Instalando @supabase/supabase-js...
npm install @supabase/supabase-js

echo.
echo Instalação concluída!
echo Agora você pode rodar o aplicativo com: npm run dev
pause