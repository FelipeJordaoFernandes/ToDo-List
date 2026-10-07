# Identidade visual e arte — 2026-10-07

Aplicação local do guia central de identidade visual do Obsidian, consultado com a ficha do projeto e as orientações do Vault. A referência de cor foi conferida em `src/styles.css` do Portfólio: verde `#245f3a`, texto `#202824` e a família de verdes suaves. Papel claro, neutros, raios, sombras e escalas são decisões deste projeto, sem estabelecer um novo padrão pessoal global.

O painel sólido parece uma folha sobre a mesa. Superfícies sem transparência/desfoque, espaço de leitura generoso, hierarquia curta, ações de 44–48 px, transições discretas e respeito ao movimento reduzido. Tipografia do sistema evita dependência externa; a combinação tipográfica candidata do guia não foi tratada como aprovada. Broto não foi incluído por não ser necessário à tarefa.

## Fundo gerado

Duas ilustrações produzidas com a ferramenta imagegen: uma horizontal e uma adaptação vertical. Mesa anime/chibi com poucos materiais de escritório arredondados nas bordas; centro livre para a lista HTML. Os arquivos PNG originais permanecem na saída local do gerador. O projeto consome apenas os WebP otimizados, sem renderizar texto ou controles dentro da imagem.

Prompt horizontal: mesa vista de cima; estilo anime/chibi, traço fino, sombras suaves, verde sálvia/creme; porta-lápis, borracha, caderno fechado, clipes e caneta nas bordas; 65% central vazio; sem texto, logotipos, interface, pessoas ou padrões agitados.

Adaptação mobile: preservar aparência/paleta da referência, composição vertical 2:3, centro de 80% livre, poucos objetos nos extremos superiores e caneta no canto inferior direito; sem texto ou interface.

| Arquivo | Dimensões | Peso |
| --- | --- | --- |
| `public/desk-1536.webp` | 1536 × 1024 | 77.374 bytes |
| `public/desk-mobile.webp` | 768 × 1152 | 15.470 bytes |

O fundo antigo tinha 207.531 bytes. O desktop ficou aproximadamente 63% menor e o mobile 93% menor. CSS seleciona a versão vertical até 600 px, com `cover`, fallback sólido e imagem decorativa fora da árvore de acessibilidade.

Favicon SVG, PNG e Apple Touch Icon compartilham o símbolo de checklist verde. A imagem de compartilhamento é independente de dados de tarefas.

Para regenerar versões comprimidas e assets de marca a partir dos PNGs escolhidos:

```sh
node scripts/generate-assets.mjs caminho/mesa-horizontal.png caminho/mesa-vertical.png
```

As imagens finais estão no repositório; o build não depende dos PNGs originais nem de geração de imagem.
