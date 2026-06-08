# Meu To Do - Instalação

## Pré-requisitos
- Node.js (versão 18+)
- npm ou yarn

## Instalação das Dependências
Execute o seguinte comando no terminal:

```bash
npm install
```

Se você estiver em um Windows com restrições de execução de script, use:

```bash
npm install supabase-js
```

Para usar o Supabase real, adicione as seguintes variáveis de ambiente ao seu `.env`:

```env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-anonima
```

## Demo com Autenticação Local
Se não conseguir instalar o Supabase, use a autenticação local:

- Login: test@example.com
- Senha: password

## Execução
```bash
npm run dev