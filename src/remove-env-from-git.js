#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');

console.log('Removendo .env do rastreamento do Git...');

try {
  // Remove o arquivo do rastreamento do Git mas mantém no disco
  execSync('git rm --cached .env', { stdio: 'inherit' });
  
  // Garante que o .gitignore está atualizado
  const gitignoreContent = `# Logs
logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
lerna-debug.log*

# Dependencies
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*
.pnpm-debug.log*

# Build outputs
dist/
dist-ssr/
build/
*.tsbuildinfo

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local
.env.*

# IDE
.vscode/
.idea/
*.swp
*.swo
*~

# OS
.DS_Store
.DS_Store?
._*
.Spotlight-V100
.Trashes
ehthumbs.db
Thumbs.db

# Runtime data
pids
*.pid
*.seed
*.pid.lock

# Coverage directory used by tools like istanbul
coverage/
*.lcov

# nyc test coverage
.nyc_output

# node-waf configuration
.lock-wscript

# Compiled binary addons (https://nodejs.org/api/addons.html)
build/Release

# Dependency directories
jspm_packages/

# Optional npm cache directory
.npm

# Optional eslint cache
.eslintcache

# Output of 'npm pack'
*.tgz

# Yarn Integrity file
.yarn-integrity

# dotenv environment variables file
.env
.env.development
.env.test
.env.production

# parcel-bundler cache (https://parceljs.org/)
.cache
.parcel-cache

# Next.js build output
.next

# Nuxt.js build / generate output
.nuxt
dist

# Gatsby files
.cache/
public

# Storybook build outputs
.out
.storybook-out

# Temporary folders
tmp/
temp`;

  fs.writeFileSync('.gitignore', gitignoreContent);
  
  // Adiciona o .gitignore ao staging
  execSync('git add .gitignore', { stdio: 'inherit' });
  
  // Faz commit da mudança
  execSync('git commit -m "Remove .env from Git tracking and update .gitignore"', { stdio: 'inherit' });
  
  console.log('✅ .env removido do rastreamento do Git com sucesso!');
  console.log('✅ .gitignore atualizado com todas as configurações necessárias.');
  console.log('✅ Commit realizado. Execute "git push" para enviar para o GitHub.');
  
} catch (error) {
  console.error('❌ Erro ao remover .env do rastreamento do Git:', error.message);
  console.log('Por favor, execute manualmente:');
  console.log('git rm --cached .env');
  console.log('git add .gitignore');
  console.log('git commit -m "Remove .env from Git tracking"');
}