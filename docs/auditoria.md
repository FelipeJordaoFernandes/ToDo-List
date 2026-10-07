# Auditoria de qualidade — 2026-10-07

Build local de produção em `http://127.0.0.1:4174/`, Lighthouse 13.5.0, Chrome headless, perfis mobile/desktop padrão. Inicial: uma medição por perfil. Final: três por perfil, todas com os mesmos resultados abaixo. Os JSON/HTML completos estão em `artifacts/lighthouse/`; resumos versionados em `docs/evidencias.json`.

| Perfil | Momento | Performance | Acessibilidade | Boas Práticas | SEO |
| --- | --- | --- | --- | --- | --- |
| Mobile | Inicial | 93 | 89 | 96 | 83 |
| Mobile | Final, mediana | 100 | 100 | 100 | 100 |
| Desktop | Inicial | 99 | 89 | 100 | 83 |
| Desktop | Final, mediana | 100 | 100 | 100 | 100 |

Final mobile: LCP mediano ~1,50 s; desktop ~0,36 s. TBT e CLS zero nas seis medições. São resultados de laboratório local, sem dados de usuários reais ou garantia da mesma pontuação em produção/dispositivos/redes diferentes.

## Correções

- Fundo WebP com versão mobile, estado vazio vetorial com dimensões explícitas, remoção da fonte externa e de assets obsoletos.
- HTML inicial pré-renderizado/hidratado para exibir conteúdo antes do React. Nenhum dado local entra no build.
- Idioma `pt-BR`, título To Do List, descrição, canonical, Open Graph/Twitter, favicon correto, robots e sitemap de uma página pública. As tarefas continuam locais.
- Nomes acessíveis em ações, checkbox associado ao texto, rótulo/hint do formulário, nome do diálogo, foco visível e fluxo de teclado com retorno ao acionador.
- Validação de entrada vazia/espaços, foco após mover/excluir tarefa, quebra de textos longos e layout em telas estreitas.
- Inicialização/persistência defensivas, preservando o formato legado e dados inválidos originais. Falhas de leitura/gravação geram aviso e uso somente em memória.
- Dependências compatíveis atualizadas: nove alertas iniciais do npm audit eliminados; auditoria final sem vulnerabilidades conhecidas. Não equivale a uma auditoria de segurança completa.

## Validação funcional e acessibilidade

Lint, quatro testes Node, build e diff check aprovados. Chrome: 25 estados axe; Edge: 28 estados, incluindo telas baixas/horizontal. Sem violações axe ou erros JavaScript no roteiro. Larguras 320/390/768/1024/1440 px; cenários adicionais 844×390, 320×568 e 768×600. Capturas de desktop/mobile/tablet e modal inspecionadas.

Fluxos cobertos: criar, editar, concluir, reabrir, excluir, persistir/recarregar, dados legados, formulário em branco/espaços, Escape, Tab/Shift+Tab, retorno de foco, texto de 500 caracteres, texto a 200%, movimento reduzido, dados corrompidos, armazenamento bloqueado e cota esgotada. HTML sem JavaScript mostra o conteúdo e instrução, com criação desabilitada.

O axe registrou revisão incompleta de contraste em `#task-hint` dentro do diálogo nativo: uma ocorrência no Chrome e duas no Edge. As ocorrências foram mantidas nos relatórios e revisadas visualmente; não há sobreposição visível. Cores `#58665b` sobre `#fcfcf7` têm contraste **5,89:1**. Nenhuma regra foi desligada. Não afirmar ausência de verificações incompletas nem conformidade WCAG integral.

## Observações residuais

Lighthouse ainda sugere reduzir ~28 KiB de JavaScript não utilizado (principalmente runtime React) e identifica CSS inicial como recurso bloqueante. O CSS é pequeno (~2 KiB gzip); os resultados medidos não justificaram dividir os componentes pequenos ou adicionar infraestrutura.

Os dois motivos de falha de bfcache são sinalizações/linha de comando do navegador automatizado (`BackForwardCacheDisabled`, `BackForwardCacheDisabledByCommandLine`), classificados pelo Lighthouse como sem ação possível. Não são atribuídos ao código da aplicação.

Verificações parciais não substituem testes com leitores de tela, navegadores/dispositivos adicionais, avaliação WCAG integral ou métricas reais de produção. A etapa deve ser revisada na PR; merge e produção exigem o fechamento posterior autorizado.

Referências: [Lighthouse](https://developer.chrome.com/docs/lighthouse/overview), [diálogo nativo](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/dialog).
