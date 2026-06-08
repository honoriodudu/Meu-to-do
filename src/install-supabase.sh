#!/bin/bash

echo "Instalando dependências do Supabase..."
echo ""

# Verificar se npm está disponível
if ! command -v npm &> /dev/null; then
    echo "npm não encontrado. Por favor, instale Node.js primeiro."
    exit 1
fi

echo "Instalando @supabase/supabase-js..."
npm install @supabase/supabase-js

echo ""
echo "Instalação concluída!"
echo "Agora você pode rodar o aplicativo com: npm run dev"