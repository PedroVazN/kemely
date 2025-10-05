#!/bin/bash

echo "========================================"
echo "   KEMELY FINANCEIRO - INSTALACAO"
echo "========================================"
echo

echo "[1/3] Instalando dependencias..."
npm install
if [ $? -ne 0 ]; then
    echo "ERRO: Falha na instalacao das dependencias"
    exit 1
fi

echo
echo "[2/3] Verificando instalacao..."
npm list --depth=0
if [ $? -ne 0 ]; then
    echo "ERRO: Verificacao falhou"
    exit 1
fi

echo
echo "[3/3] Iniciando aplicacao..."
echo
echo "========================================"
echo "   APLICACAO INICIADA COM SUCESSO!"
echo "========================================"
echo
echo "A aplicacao sera aberta em: http://localhost:3000"
echo
echo "Para parar a aplicacao, pressione Ctrl+C"
echo

npm start
