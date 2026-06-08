# Meu To Do - Instalação

## Pré-requisitos
- Node.js (versão 18+)
- npm ou yarn

## Instalação das Dependências

### Método 1: Usar scripts fornecidos
Execute o script correspondente ao seu sistema:

**Windows:**
```bash
src/install-deps.bat
```

**Linux/Mac:**
```bash
chmod +x src/install-deps.sh
./src/install-deps.sh
```

### Método 2: Instalação manual
Se os scripts não funcionarem, instale manualmente:
```bash
npm install
```

### Método 3: Instalar apenas o Supabase
```bash
npm install @supabase/supabase-js
```

## Configuração do Supabase

### 1. Execute o SQL no Supabase
Copie e cole o conteúdo de `database-setup.sql` no SQL Editor do seu projeto Supabase.

### 2. Execute exemplos (opcional)
Copie e cole o conteúdo de `database-examples.sql` para testar as consultas.

## Demo com Autenticação Local
Se não conseguir configurar o Supabase, use a autenticação local:

- Login: test@example.com
- Senha: password

## Execução
```bash
npm run dev
```

## Estrutura do Projeto
- `src/integrations/supabase/` - Configuração do Supabase
- `src/lib/database.ts` - Funções de banco de dados
- `src/contexts/AuthContext.tsx` - Contexto de autenticação
- `src/pages/SQLEditor.tsx` - Editor SQL