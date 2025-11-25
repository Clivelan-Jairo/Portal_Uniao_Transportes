# Portal União Transportes — Frontend

Este repositório contém o frontend (Vite + React) do site Portal União Transportes.

Sumário rápido
- Rodar em desenvolvimento
- Como configurar a API em produção (`VITE_API_BASE`)
- Deploy (Vercel / GitHub Pages)
- Notas das últimas correções

## Rodando localmente (Windows / PowerShell)
1. Instale dependências:
```powershell

2. Rodar em modo dev (Vite):
```powershell
npm run dev

O Vite abre em `http://localhost:3000/` por padrão.

## Gerar build de produção
```powershell

## Variável de ambiente para produção
- `VITE_API_BASE`: base (origin) da API de rastreio. Exemplo:
  - `https://ssw.inf.br`

**Importante:** NÃO inclua o path `/api/trackingdest` no valor — o código monta o endpoint como `${VITE_API_BASE}/api/trackingdest`.

## Vercel
- Para deploy no Vercel defina a _Environment Variable_ `VITE_API_BASE` no painel do projeto (Settings → Environment Variables) com o valor `https://ssw.inf.br` e redeploy.

- Alternativa (proxy): há um `vercel.json` com rewrites que proxyam `/api/*` para `https://ssw.inf.br/api/*` para evitar problemas de CORS e dependência direta da variável.

## GitHub Pages
- GitHub Pages não faz proxy. Para publicar via GitHub Pages use GitHub Actions que injetem `VITE_API_BASE` durante o build (ex.: workflow que define `VITE_API_BASE` no passo de build).

## Captura de logs do dev server (Windows PowerShell)
```powershell
# Recomendado: use cmd.exe para redirecionamento simples
# Em cmd.exe:
# cd <repo>

# Alternativa PowerShell:
npm run dev 2>&1 | Out-File -FilePath .\\dev.log -Encoding utf8
# reproduza e Ctrl+C, depois:
Get-Content .\\dev.log -Tail 400

## Notas importantes e histórico das últimas correções
- Corrigido problema onde a seção "Cidades atendidas" ficava invisível (forçamos visibilidade temporariamente e depois ajustamos para um comportamento robusto).
- Substituídas consultas `document.querySelector` por `refs` no componente de mapa para evitar problemas de timing.

- Adicionado logger cliente temporário para debug que grava erros em `localStorage` (executa apenas em `DEV`).
- Adicionado `vercel.json` para rewrite `/api/*` → `https://ssw.inf.br/api/*` (ajuda em produção).

## Contribuições
- Faça fork, branch com nome descritivo, commit e pull request. Ao enviar PR, descreva o problema e como testar.

Se precisar, posso adicionar um workflow de GitHub Actions pronto para o deploy no GitHub Pages ou ajustar o `vercel.json` conforme sua preferência.
# Portal União Transportes — Frontend

Este repositório contém o frontend (Vite + React) do site Portal União Transportes.

Sumário rápido
- Rodar em desenvolvimento
- Como configurar a API em produção (`VITE_API_BASE`)
- Deploy (Vercel / GitHub Pages)
- Notas das últimas correções

## Rodando localmente (Windows / PowerShell)
1. Instale dependências:
```powershell
npm ci
```
2. Rodar em modo dev (Vite):
```powershell
npm run dev
```
O Vite abre em `http://localhost:3000/` por padrão.

## Gerar build de produção
```powershell
npm run build
# servir dist localmente para testar
npx http-server ./dist -p 5000
```

## Variável de ambiente para produção
- `VITE_API_BASE`: base (origin) da API de rastreio. Exemplo:
  - `https://ssw.inf.br`

**Importante:** NÃO inclua o path `/api/trackingdest` no valor — o código monta o endpoint como `${VITE_API_BASE}/api/trackingdest`.

## Vercel
- Para deploy no Vercel defina a _Environment Variable_ `VITE_API_BASE` no painel do projeto (Settings → Environment Variables) com o valor `https://ssw.inf.br` e redeploy.
- Alternativa (proxy): há um `vercel.json` com rewrites que proxyam `/api/*` para `https://ssw.inf.br/api/*` para evitar problemas de CORS e dependência direta da variável.

## GitHub Pages
- GitHub Pages não faz proxy. Para publicar via GitHub Pages use GitHub Actions que injetem `VITE_API_BASE` durante o build (ex.: workflow que define `VITE_API_BASE` no passo de build).

## Captura de logs do dev server (Windows PowerShell)
```powershell
# Recomendado: use cmd.exe para redirecionamento simples
# Em cmd.exe:
# cd <repo>
# npm run dev > dev.log 2>&1
# reproduza o bug no navegador e então Ctrl+C
# no PowerShell para visualizar:
powershell -Command "Get-Content .\\dev.log -Tail 400"

# Alternativa PowerShell:
npm run dev 2>&1 | Out-File -FilePath .\dev.log -Encoding utf8
# reproduza e Ctrl+C, depois:
Get-Content .\dev.log -Tail 400
```

## Notas importantes e histórico das últimas correções
- Corrigido problema onde a seção "Cidades atendidas" ficava invisível (forçamos visibilidade temporariamente e depois ajustamos para um comportamento robusto).
- Substituídas consultas `document.querySelector` por `refs` no componente de mapa para evitar problemas de timing.
- Adicionado logger cliente temporário para debug que grava erros em `localStorage` (executa apenas em `DEV`).
- Adicionado `vercel.json` para rewrite `/api/*` → `https://ssw.inf.br/api/*` (ajuda em produção).

## Contribuições
- Faça fork, branch com nome descritivo, commit e pull request. Ao enviar PR, descreva o problema e como testar.

Se precisar, posso adicionar um workflow de GitHub Actions pronto para o deploy no GitHub Pages ou ajustar o `vercel.json` conforme sua preferência.
