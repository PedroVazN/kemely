@echo off
echo ========================================
echo    KEMELY FINANCEIRO - INSTALACAO
echo ========================================
echo.

echo [1/3] Instalando dependencias...
call npm install
if %errorlevel% neq 0 (
    echo ERRO: Falha na instalacao das dependencias
    pause
    exit /b 1
)

echo.
echo [2/3] Verificando instalacao...
call npm list --depth=0
if %errorlevel% neq 0 (
    echo ERRO: Verificacao falhou
    pause
    exit /b 1
)

echo.
echo [3/3] Iniciando aplicacao...
echo.
echo ========================================
echo   APLICACAO INICIADA COM SUCESSO!
echo ========================================
echo.
echo A aplicacao sera aberta em: http://localhost:3000
echo.
echo Para parar a aplicacao, pressione Ctrl+C
echo.

call npm start
