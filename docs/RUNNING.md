<p align="center">
  <img src="../assets/readme/banners/storybook.png" alt="Storybook" width="100%">
</p>

# Execução local

Use Node.js 24 ou superior e npm 11 ou superior, conforme o manifesto. O guia comum está em [TYPESCRIPT.md](https://github.com/Solierrr/docs-warehouse/blob/main/readme/running/TYPESCRIPT.md).

Execute `make install` e, quando o desenvolvimento precisar, use o `make vault` para exportar a pasta `/vite`, sabendo que o build gera os tokens, o branding de e-mail, os módulos, os tipos e os assets.

| Comando | Efeito |
|---|---|
| `make test` | Vitest |
| `make lint` | ESLint e typecheck |
| `make build` | Constrói `dist/` |
| `npm run pack:check` | Mostra o conteúdo do pacote sem publicar |
| `npm run storybook` | Catálogo local na porta 6006 |
| `npm run test:observability` | Testes Node da entrada de observabilidade |

Para conferir a biblioteca num consumidor local, construa o pacote e gere um tarball com `npm pack`, e depois instale de novo o arquivo atualizado na aplicação, que não lê automaticamente os fontes da biblioteca.