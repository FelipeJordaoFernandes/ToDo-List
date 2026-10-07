# To Do List

Uma lista de tarefas simples e acolhedora: organize o dia, edite seus planos e acompanhe o que já concluiu.

[Aplicação publicada](https://to-do-list-seven-lyart-36.vercel.app/) · [Auditoria e limites](docs/auditoria.md) · [Direção visual e arte](docs/identidade-e-arte.md)

## Funcionalidades

- Criar, editar, concluir, reabrir e excluir tarefas.
- Grupos de tarefas a fazer e concluídas, contadores e estado vazio.
- Persistência no navegador pela chave legada `todos`, preservando identificadores e campos existentes.
- Aviso e uso temporário em memória se o armazenamento estiver bloqueado, cheio ou inválido. Dados inválidos originais não são sobrescritos.
- Modal com formulário rotulado, validação de espaços em branco, Escape, ciclo de Tab/Shift+Tab e retorno do foco.
- Layout responsivo, fundo ilustrado com versão mobile, foco visível e movimento reduzido.
- HTML inicial pré-renderizado, metadados de compartilhamento, canonical, robots e sitemap.

Não há conta, servidor de tarefas ou sincronização entre dispositivos. Limpar os dados do site remove as tarefas salvas. As tarefas privadas não são incluídas no HTML gerado durante o build.

## Tecnologias

React 19, JavaScript, Vite, CSS comum por componente, Context API e localStorage. ESLint, testes nativos do Node, Playwright, axe e Lighthouse apoiam a validação. Sharp otimiza os assets. Não utiliza CSS Modules.

Projeto originado de estudos React na Alura, posteriormente refinado com identidade própria, acessibilidade, responsividade e auditorias de qualidade.

## Executar

Requer Node.js **22.19 ou superior** e npm. Os testes de navegador e Lighthouse usam Google Chrome instalado; `AUDIT_BROWSER=msedge` seleciona Edge no teste de interface.

```sh
npm ci
npm run dev
```

O Vite informa o endereço local (normalmente `http://localhost:5173`).

```sh
npm run lint
npm test
npm run build
npm run preview -- --host 127.0.0.1 --port 4174 --strictPort
```

O build gera `dist/` com a interface inicial renderizada e hidratada pelo React. O botão de criação só é habilitado depois da inicialização, impedindo interação com HTML ainda sem JavaScript.

Com a prévia em execução, abra outro terminal:

```sh
npm run audit:ui
npm run audit:lighthouse
npm audit
```

Os scripts usam `http://127.0.0.1:4174/`. `AUDIT_URL` altera o destino, `AUDIT_RUNS` a quantidade de medições Lighthouse (padrão: 3 por perfil), e `AUDIT_PHASE` identifica a pasta de evidências. Configure essas variáveis conforme seu shell. Use uma origem de teste: os roteiros de interface criam tarefas fictícias em perfis descartáveis do navegador.

Relatórios JSON/HTML e capturas ficam em `artifacts/`, ignorado pelo Git. O resumo da revisão está versionado em `docs/`.

## Estrutura

- `src/App.jsx`: composição da interface.
- `src/components/`: controles, modal, formulário, grupos e contexto.
- `src/storage.js`: leitura/gravação defensiva mantendo o contrato legado.
- `src/index.css`: tokens locais e layout responsivo.
- `src/prerender.jsx` e `scripts/build.mjs`: HTML inicial no build, sem dados pessoais.
- `public/`: arte otimizada, favicon, compartilhamento e arquivos de indexação.
- `tests/`: compatibilidade e falhas do armazenamento.
- `scripts/audit-*.mjs`: validação funcional, acessibilidade e Lighthouse.

## Publicação

GitHub integrado à Vercel. A branch principal é `master`. Alterações seguem por PR; a prévia da PR e a produção são ambientes distintos. O merge exige aprovação explícita. As URLs públicas dos metadados apontam para a produção; seus novos assets ficam disponíveis nela após integrar a PR.
